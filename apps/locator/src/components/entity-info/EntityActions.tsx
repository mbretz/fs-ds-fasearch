import type { ReactNode } from 'react';
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
  onPrimaryAction?: () => void;
  /**
   * Renders the secondary "New Client Inquiry" button when provided --
   * identical label/behavior in both confirmed usages (AdvisorCard's
   * `.FA-Card-Actions` and the profile-page Hero's own "Actions" row),
   * gated by Figma's "Show New Client Inquiry"/"Show Inquiry Button"
   * property in each, so this is modeled as "was a handler passed in"
   * rather than a separate boolean prop.
   */
  onNewClientInquiry?: () => void;
  /** Matches Figma's Inline/Block orientation variants. */
  orientation?: 'inline' | 'block';
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
  onPrimaryAction,
  onNewClientInquiry,
  orientation = 'inline',
  className,
}: EntityActionsProps) {
  // Block (stacked) only, per the user -- inline (side by side) keeps its
  // original natural-width, centered sizing untouched below. `flex-1` on
  // each button here grows it to fill the column's width (block's own
  // main axis is vertical, so `flex-1` sizing is safe -- it distributes
  // extra *height*, not width, and there's no extra height to distribute
  // since each button's own content already sets the column's height).
  if (orientation === 'block') {
    return (
      <div className={cn('flex items-stretch', className)}>
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
          {primaryHref ? (
            <Button.Root variant="primary" asChild className="min-w-0">
              <a href={primaryHref}>
                {primaryIcon && <Button.Icon>{primaryIcon}</Button.Icon>}
                <Button.Label>{primaryLabel}</Button.Label>
              </a>
            </Button.Root>
          ) : (
            <Button
              variant="primary"
              iconStart={primaryIcon}
              onClick={onPrimaryAction}
              className="min-w-0"
            >
              {primaryLabel}
            </Button>
          )}
          {onNewClientInquiry && (
            <Button
              variant="secondary"
              onClick={onNewClientInquiry}
              className="min-w-0"
            >
              New Client Inquiry
            </Button>
          )}
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
              asChild
              className="entity-actions-button"
            >
              <a href={primaryHref}>
                {primaryIcon && <Button.Icon>{primaryIcon}</Button.Icon>}
                <Button.Label>{primaryLabel}</Button.Label>
              </a>
            </Button.Root>
          ) : (
            <Button
              variant="primary"
              iconStart={primaryIcon}
              onClick={onPrimaryAction}
              className="entity-actions-button"
            >
              {primaryLabel}
            </Button>
          )}
          {onNewClientInquiry && (
            <Button
              variant="secondary"
              onClick={onNewClientInquiry}
              className="entity-actions-button"
            >
              New Client Inquiry
            </Button>
          )}
        </div>
        <div aria-hidden className="entity-actions-spacer shrink basis-0" />
      </div>
    </div>
  );
}
