import type { MouseEvent, ReactNode } from 'react';
import { Button } from 'ds';
import { cn } from '../../utils/cn';

export interface EntityActionsProps {
  primaryLabel: string;
  primaryIcon?: ReactNode;
  /**
   * A `tel:`/`mailto:`/route href for the primary action. When set, the
   * primary action renders as a real link styled like a Button (the
   * compound `Button.Root`/`.Icon`/`.Label` `asChild` API -- see
   * `Button.stories.tsx`'s "Compound" story) instead of the flat `Button`
   * convenience component, since e.g. a phone number is navigation
   * (`tel:...`), not a click handler with nothing to actually call.
   * Takes precedence over `onPrimaryAction` when both are passed.
   */
  primaryHref?: string;
  /**
   * Renders the primary action's `<a>` as inert (`href="#"`,
   * `aria-disabled`, `tabIndex={-1}`, a `preventDefault`
   * click handler, `cursor-not-allowed`) instead of real navigation --
   * the same fake-disabled treatment ContactLinks.tsx/OfficeDetailsPanel.tsx
   * use for every other not-really-wired-up destination in this
   * prototype. Only meaningful alongside `primaryHref`; ignored when
   * the primary action is `onPrimaryAction` instead, since that's
   * already caller-controlled. Opt-in (default `false`) since this
   * component has other, already-real-navigation callers.
   */
  primaryInert?: boolean;
  onPrimaryAction?: () => void;
  /**
   * Renders the secondary "New Client Inquiry" button when provided --
   * identical label/behavior in both confirmed usages (AdvisorCard's
   * `.FA-Card-Actions` and the profile-page Hero's own "Actions" row),
   * gated by Figma's "Show New Client Inquiry"/"Show Inquiry Button"
   * property in each, so this is modeled as "was a handler OR href
   * passed in" rather than a separate boolean prop.
   */
  onNewClientInquiry?: () => void;
  /**
   * A same-page anchor (`#...`) or route href for the secondary action.
   * When set, renders as a real link styled like a Button (same
   * `Button.Root`/`.Icon`/`.Label` `asChild` pattern as `primaryHref`
   * above) instead of the flat `Button` convenience component -- per
   * the user, 2026-09-23: on mobile advisor profile pages, this button
   * either scrolls to the inline New Client Inquiry form (a `#`
   * fragment) or navigates to the dedicated inquiry route, depending on
   * viewport width; neither is "a click handler with nothing to
   * actually call" the way `onNewClientInquiry` alone models it. Takes
   * precedence over `onNewClientInquiry` when both are passed.
   */
  newClientInquiryHref?: string;
  /**
   * Optional `onClick` for the `newClientInquiryHref` link (ignored when
   * `newClientInquiryHref` is unset). Per the user, 2026-09-23: plain
   * CSS `scroll-margin-top` on the scroll target doesn't reliably offset
   * a native URL-fragment jump the way it does `Element.scrollIntoView()`
   * (confirmed live -- the fragment link landed flush at the viewport
   * top, ignoring the target's own `scroll-margin-top` entirely) --
   * `AdvisorHero.tsx`'s scroll-to-form link passes a handler here that
   * calls `scrollIntoView` directly instead. The `href` itself is kept
   * regardless (this handler calls `preventDefault()` itself when it
   * wants to take over), so a no-JS/JS-failure case still gets the
   * native (un-offset) jump as a fallback rather than a dead link.
   */
  onNewClientInquiryClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  /** Matches Figma's Inline/Block orientation variants. */
  orientation?: 'inline' | 'block';
  /**
   * Block orientation only. Default (`false`) keeps the row's two
   * `shrink`-able spacers, which read as though they give up their own
   * 16px each before the buttons need to squeeze -- but never actually
   * do: they're `flex-grow-0` with a real `basis-[large]`, while the
   * content between them is `flex-1` (`flex-basis: 0%`), so the content
   * carries the entire negative-space share in the browser's flex-shrink
   * math and the spacers stay pinned at exactly 16px at every width
   * (confirmed live). `true` drops both spacers and folds the whole
   * inset into one `clamp()`-based margin on the content div instead --
   * a real floor that's actually reached at a narrow width, not just
   * described in a comment. Opt-in so `AdvisorHero`'s own existing block
   * usage (which never gets this narrow) keeps its current, unaffected
   * rendering; added for `FavoriteCard`, per the user, whose 220px floor
   * has no slack for a permanently-frozen 32px inset.
   */
  flexibleInset?: boolean;
  /**
   * Block orientation only. Drops the row's own horizontal
   * inset/spacers entirely (buttons run edge-to-edge with their parent
   * instead) -- for a map pin popover, per the user, whose own outer
   * padding already insets everything including this row; ignored when
   * `flexibleInset` is also set (that branch has no fixed inset to
   * drop in the first place).
   */
  noInset?: boolean;
  /** Forwarded to every `Button`/`Button.Root` this component renders --
   * a map pin popover's own limited space wants `'condensed'`, per the
   * user; every other caller leaves this unset (DS `Button`'s own
   * default). */
  density?: 'roomy' | 'condensed';
  className?: string;
}

// "View Profile" + the row's own 16px gap + "New Client Inquiry" -- these
// two buttons' actual natural combined width, measured via Playwright
// against the real rendered DS `Button`s (123.8px + 16px + 172.2px =
// 312px), not assumed from font metrics. Below this, the row can't fit
// both buttons side by side without either wrapping (handled below) or a
// label itself wrapping (which this exists to avoid). Revisit if either
// button's label text changes meaningfully.
const STACK_BELOW_PX = 312;

// See `primaryInert`'s own doc comment above for why this exists.
function preventDisabledClick(event: { preventDefault: () => void }) {
  event.preventDefault();
}

// Matches `.FA-Card-Actions` (`1351:34797`) *and* the profile-page Hero's
// own "Actions" row (`421:6266`, the Hero-FA-Mobile reference) -- the same
// primary+secondary button shape reused in both places. The Hero swaps
// the card's plain "View Profile" primary button for a phone-icon
// "Call <number>" button while keeping "New Client Inquiry" identical, so
// the primary button's content is a prop here, not a hardcoded label --
// each caller supplies whatever action fits its own context.
export function EntityActions({
  primaryLabel,
  primaryIcon,
  primaryHref,
  primaryInert = false,
  onPrimaryAction,
  onNewClientInquiry,
  newClientInquiryHref,
  onNewClientInquiryClick,
  orientation = 'inline',
  flexibleInset = false,
  noInset = false,
  density,
  className,
}: EntityActionsProps) {
  const showsNewClientInquiry = Boolean(
    onNewClientInquiry || newClientInquiryHref,
  );
  // Computed once, reused by both the block and inline orientation's own
  // `<a>` below, rather than duplicating this ternary in each -- a plain
  // native `<a>` accepts any of these as valid attributes regardless of
  // which branch is live, so spreading is type-safe here even though it
  // wouldn't be onto a custom component with a narrower prop type.
  // `!cursor-not-allowed` (not a plain `cursor-not-allowed`) -- confirmed
  // live (Playwright), `Button`'s own base classes always include
  // `cursor-pointer`, which won the cascade over a plain override
  // regardless of DOM class-list order, since Tailwind's generated
  // stylesheet places `.cursor-pointer` after `.cursor-not-allowed`
  // (alphabetical within the utility group) -- the computed `cursor`
  // stayed `pointer` despite this override being present in the class
  // list. Tailwind's `!` important-modifier forces it to actually win.
  const primaryAnchorProps = primaryInert
    ? {
        href: '#',
        'aria-disabled': 'true' as const,
        tabIndex: -1,
        onClick: preventDisabledClick,
        className: '!cursor-not-allowed',
      }
    : { href: primaryHref };
  // Block (stacked) only, per the user -- inline (side by side) keeps its
  // original natural-width, centered sizing untouched below. `flex-1` on
  // each button here grows it to fill the column's width (block's own
  // main axis is vertical, so `flex-1` sizing is safe -- it distributes
  // extra *height*, not width, and there's no extra height to distribute
  // since each button's own content already sets the column's height).
  if (orientation === 'block') {
    const buttons = (
      <>
        {primaryHref ? (
          <Button.Root
            variant="primary"
            density={density}
            asChild
            className="min-w-0"
          >
            <a {...primaryAnchorProps}>
              {primaryIcon && <Button.Icon>{primaryIcon}</Button.Icon>}
              <Button.Label>{primaryLabel}</Button.Label>
            </a>
          </Button.Root>
        ) : (
          <Button
            variant="primary"
            density={density}
            iconStart={primaryIcon}
            onClick={onPrimaryAction}
            className="min-w-0"
          >
            {primaryLabel}
          </Button>
        )}
        {showsNewClientInquiry &&
          (newClientInquiryHref ? (
            <Button.Root
              variant="secondary"
              density={density}
              asChild
              className="min-w-0"
            >
              <a href={newClientInquiryHref} onClick={onNewClientInquiryClick}>
                <Button.Label>New Client Inquiry</Button.Label>
              </a>
            </Button.Root>
          ) : (
            <Button
              variant="secondary"
              density={density}
              onClick={onNewClientInquiry}
              className="min-w-0"
            >
              New Client Inquiry
            </Button>
          ))}
      </>
    );

    if (flexibleInset) {
      // One `clamp()`-based margin standing in for the non-flexible
      // branch's whole spacer+fixed-margin structure -- see this prop's
      // own doc comment for why that structure doesn't actually shrink
      // in practice. Calibrated (same `vw`-reads-the-viewport reasoning
      // as `FavoritesComparatorDialog`'s own row gap, since a
      // `FavoriteCard`'s width already tracks the viewport predictably
      // across its real range) so the floor (8px, per the user --
      // combined with `Card.Root`'s own fixed 8px padding, ~16px total
      // from the card's outer edge) is actually reached by 768px -- the
      // comparator's narrowest real viewport -- and the ceiling (32px,
      // this row's own previous constant total) by 1440px, both
      // confirmed live with a safety margin past each end rather than
      // just asymptotically approaching them.
      return (
        <div
          className={cn(
            'flex min-w-0 flex-col items-stretch gap-[var(--density-spacing-fixed-large)] mx-[clamp(var(--density-spacing-fixed-small),calc(4.2vw_-_26px),var(--density-spacing-fixed-xxx-large))]',
            className,
          )}
        >
          {buttons}
        </div>
      );
    }

    if (noInset) {
      // 8px (`fixed-small`), not this component's own default 16px
      // (`fixed-large`) row gap -- per the user, for this tighter,
      // no-inset (map pin popover) context specifically.
      return (
        <div
          className={cn(
            'flex min-w-0 flex-col items-stretch gap-[var(--density-spacing-fixed-small)]',
            className,
          )}
        >
          {buttons}
        </div>
      );
    }

    return (
      <div className={cn('flex min-w-0 items-stretch', className)}>
        {/* Left/right spacers, not padding on the row itself: `mx-large`
            (16px) on the outer row is a fixed floor matching the
            Separator's own inset exactly (buttons never sit wider than
            the divider above them); each spacer adds up to 16px more on
            top of that (32px total, "16px inset *relative to* the
            Separator", per the user) but shrinks toward 0 first -- before
            the buttons themselves are squeezed enough to wrap their own
            labels -- since it has no other content competing for space. */}
        <div
          aria-hidden
          className="shrink basis-[var(--density-spacing-fixed-large)]"
        />
        <div className="mx-[var(--density-spacing-fixed-large)] flex min-w-0 flex-1 flex-col items-stretch gap-[var(--density-spacing-fixed-large)]">
          {buttons}
        </div>
        <div
          aria-hidden
          className="shrink basis-[var(--density-spacing-fixed-large)]"
        />
      </div>
    );
  }

  // Inline (default): side by side at natural width when there's room,
  // stacked full-width when there isn't. This needs its *own* local
  // container (`@container/entity-actions` below), not `entity-card` --
  // that ancestor's own 680px breakpoint marks when the *whole card*
  // switches between a stacked single column and a main+panels grid, which
  // doesn't track whether these two buttons themselves fit: measured via
  // Playwright, this row's actual card column stayed under 680px (and
  // therefore permanently "stacked" by that reading) at every viewport
  // from 350px to 1280px, which would have forced these buttons into a
  // stacked layout even where they visibly fit side by side today --
  // caught before shipping it, not assumed. `STACK_BELOW_PX` below is
  // instead measured directly off the two buttons' own natural combined
  // width ("View Profile" + gap + "New Client Inquiry"), so it tracks
  // *this* row's actual content, independent of the surrounding card.
  //
  // Plain `flex-wrap` alone would already move a too-wide second button to
  // its own line, but would leave each wrapped button at its own natural
  // (different) width -- `min-width:0`/`flex:1 1 auto` on
  // `.entity-actions-button` is what stretches each to match once stacked,
  // which is what the user actually flagged.
  //
  // Once stacked, the inset is two-tiered, per the user: the spacers'
  // shrinkable amount (and the row's own fixed-floor margin, matching the
  // Separator's inset exactly) doubles from 16px/32px-total to
  // 32px/64px-total the closer the container gets to no longer needing to
  // stack at all -- split at the midpoint of the stacked range
  // (`STACK_BELOW_PX / 2`), a deliberate design choice (more breathing
  // room once there's more room to give it), not a second measured
  // constraint like `STACK_BELOW_PX` itself.
  return (
    <div className={cn('@container/entity-actions', className)}>
      <style>{`
        @container entity-actions (max-width: ${STACK_BELOW_PX - 0.02}px) {
          .entity-actions-inner {
            flex-direction: column;
            align-items: stretch;
          }
          .entity-actions-button {
            flex: 1 1 auto;
            min-width: 0;
          }
        }
        @container entity-actions (max-width: ${STACK_BELOW_PX / 2 - 0.02}px) {
          .entity-actions-row {
            margin-inline: var(--density-spacing-fixed-large);
          }
          .entity-actions-spacer {
            flex-basis: var(--density-spacing-fixed-large);
          }
        }
        @container entity-actions (min-width: ${STACK_BELOW_PX / 2}px) and (max-width: ${STACK_BELOW_PX - 0.02}px) {
          .entity-actions-row {
            margin-inline: var(--density-spacing-fixed-xxx-large);
          }
          .entity-actions-spacer {
            flex-basis: var(--density-spacing-fixed-xxx-large);
          }
        }
      `}</style>
      <div className="entity-actions-row flex items-center">
        <div aria-hidden className="entity-actions-spacer shrink basis-0" />
        <div className="entity-actions-inner flex min-w-0 flex-1 flex-wrap items-center justify-center gap-[var(--density-spacing-fixed-large)]">
          {primaryHref ? (
            <Button.Root
              variant="primary"
              density={density}
              asChild
              className="entity-actions-button"
            >
              <a {...primaryAnchorProps}>
                {primaryIcon && <Button.Icon>{primaryIcon}</Button.Icon>}
                <Button.Label>{primaryLabel}</Button.Label>
              </a>
            </Button.Root>
          ) : (
            <Button
              variant="primary"
              density={density}
              iconStart={primaryIcon}
              onClick={onPrimaryAction}
              className="entity-actions-button"
            >
              {primaryLabel}
            </Button>
          )}
          {showsNewClientInquiry &&
            (newClientInquiryHref ? (
              <Button.Root
                variant="secondary"
                density={density}
                asChild
                className="entity-actions-button"
              >
                <a
                  href={newClientInquiryHref}
                  onClick={onNewClientInquiryClick}
                >
                  <Button.Label>New Client Inquiry</Button.Label>
                </a>
              </Button.Root>
            ) : (
              <Button
                variant="secondary"
                density={density}
                onClick={onNewClientInquiry}
                className="entity-actions-button"
              >
                New Client Inquiry
              </Button>
            ))}
        </div>
        <div aria-hidden className="entity-actions-spacer shrink basis-0" />
      </div>
    </div>
  );
}
