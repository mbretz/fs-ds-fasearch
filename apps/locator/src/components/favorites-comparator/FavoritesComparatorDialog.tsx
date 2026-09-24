import { useState, type CSSProperties } from 'react';
import { Dialog } from 'ds';
import type { Advisor, Location } from '../../data/locations';
import { FavoriteCard } from '../cards/FavoriteCard/FavoriteCard';
import { FavoritesEmptyState } from './FavoritesEmptyState';
import { NewClientInquiryDialog } from '../entity-info/NewClientInquiryDialog';

export interface FavoritesComparatorDialogProps {
  favoriteAdvisors: { advisor: Advisor; location: Location }[];
  onOpenChange: (open: boolean) => void;
}

// Desktop host for `/favorites` -- matches Figma's "FA Scorecard" (node
// `1519:62263`), minus its "Back to Results" link (per the user, real nav
// exists elsewhere already). Modeled directly on
// `NewClientInquiryDialog.tsx`'s own `Dialog.Content` usage.
// One card's width plus its own leading gap, in the row's `flex-wrap`
// gap-[xx-large] (24px) -- reused per extra card below rather than
// hardcoding the two-gap-for-three-cards case, so this scales to however
// many advisors are actually favorited instead of always reserving room
// for `FAVORITES_CAP`.
const CARD_WIDTH_PX = 360;
const CARD_GAP_PX = 24;
// A real (non-overlay) vertical scrollbar -- the classic Windows/Chrome
// default, and what macOS switches to automatically once a mouse is
// connected -- reserves layout width from Content's own `clientWidth`
// whenever its content is taller than it (which two tall cards' focus-
// area chips can trigger). Without this, the row's available width came
// out to *exactly* the cards' combined width with zero slack (confirmed
// live), so any scrollbar at all tipped it into wrapping even on a wide
// window. This repo's own dev sandbox only ever shows overlay
// scrollbars, which don't reserve width, so that regression was
// invisible to every local check here -- this buffer is sized generously
// above a typical classic scrollbar's width (~15-17px) specifically to
// survive environments this one can't reproduce.
const SCROLLBAR_SAFETY_PX = 20;

export function FavoritesComparatorDialog({
  favoriteAdvisors,
  onOpenChange,
}: FavoritesComparatorDialogProps) {
  // Clamped to at least 1 -- the empty state has no cards to size around,
  // but still reads better in a single-card-wide box than the old
  // always-3-cards-wide one. Per the user: the dialog should shrink to
  // fit however many cards there actually are, not always reserve
  // `FAVORITES_CAP` (3) worth of width regardless of count.
  const cardCount = Math.max(favoriteAdvisors.length, 1);
  const cardsWidthPx =
    cardCount * CARD_WIDTH_PX + (cardCount - 1) * CARD_GAP_PX;

  // A card's own "New Client Inquiry" button used to open a SECOND Radix
  // Dialog (its own self-contained `NewClientInquiryDialog`) on top of
  // this one -- two simultaneously open Dialogs, duplicate scrims/focus
  // traps. Per the user, 2026-09-23: this Dialog closes first, then the
  // inquiry one opens in its place -- tracking which advisor here (rather
  // than a plain boolean) is what lets the inquiry Dialog know who to
  // render for, and setting it back to `null` on its own close is what
  // brings this comparator Dialog back.
  const [inquiryAdvisor, setInquiryAdvisor] = useState<Advisor | null>(null);

  return (
    <>
      <Dialog.Root
        open={!inquiryAdvisor}
        onOpenChange={(open) => {
          if (!open) onOpenChange(false);
        }}
      >
        <Dialog.Content
          title="Comparing your favorited Financial Advisors"
          // Figma's dark frame background (`#323334`) is a real semantic
          // token -- `color-response-neutral-strong`, the same one
          // AdvisorHero's own dark banner already uses -- overridden via
          // Content's own `className`, same mechanism `NewClientInquiryDialog`
          // already uses for its `max-w-[864px]`, not a `Scrim`/
          // `scrimClassName` change: the Scrim is the page-dimming overlay
          // behind Content, a separate element from Content's own box
          // background, which is what Figma's dark frame actually is here.
          // Figma's border (`#7D8082`) needs no override at all -- it's
          // already Dialog.Content's own default `--component-dialog-
          // border-color` value.
          // `cardsWidthPx` (the actual favorited count's cards+gaps, not a
          // hardcoded `FAVORITES_CAP`-worth) plus the dialog's own
          // left/right padding, its own 1px border on each side (Content is
          // `border-box`-sized, so its border eats into the same box this
          // max-width sets -- confirmed live: leaving it out of the calc
          // left the row 2px short of fitting all 3 cards on one line,
          // wrapping the third one even at a plenty-wide viewport), and
          // `SCROLLBAR_SAFETY_PX` (see its own comment) -- exactly the
          // combined cards+gap width the user asked for, not a wider dialog
          // padded out around content or one that stays 3-cards-wide
          // regardless of how many are actually favorited. A plain `style`
          // override (not a Tailwind arbitrary class) since `cardsWidthPx`
          // is a runtime value, not a static one Tailwind can see at build
          // time. Content's own base classes still cap this against the
          // viewport (`w-[calc(100%-2*padding)]`), and the row below wraps
          // rather than shrinking cards past their own content's minimum
          // width, so this max-width is never reached in a way that could
          // force horizontal scroll.
          style={
            {
              // Overrides the shared Dialog token's own fixed 24px
              // (roomy)/20px (condensed) value, scoped to just this
              // Dialog instance via a plain inline-style custom property
              // -- it cascades over the density-selector rule that
              // otherwise sets it, with no change to Dialog.tsx or any
              // other Dialog in the app, per the user. Governs BOTH this
              // Content's own outer viewport-edge margin and its interior
              // content padding (the same token drives both), which
              // reads as one combined "left/right spacing" effect, not
              // two independently-tunable ones.
              // Calibrated the same way as the row gap/card insets above
              // it: floor (8px, `--density-spacing-fixed-small`) actually
              // reached by 768px (this Dialog's narrowest real viewport),
              // ceiling (24px, the roomy density's own current value, a
              // literal here rather than `var(...)` since referencing the
              // property being overridden inside its own override value
              // is a CSS-invalid cycle) reached by 1440px, both with a
              // safety margin confirmed live past each end.
              '--component-dialog-spacing-padding':
                'clamp(var(--density-spacing-fixed-small), calc(3vw - 17px), 24px)',
              maxWidth: `calc(${cardsWidthPx}px + 2*var(--component-dialog-spacing-padding) + 2*var(--component-dialog-border-width) + ${SCROLLBAR_SAFETY_PX}px)`,
            } as CSSProperties
          }
          className="bg-[color:var(--color-response-neutral-strong)]"
          // Content's built-in title reads `--component-dialog-text-color`,
          // tuned for its default light background -- there's no per-title
          // color override hook, so this hides it visually (kept in the a11y
          // tree for Radix's required `aria-labelledby`) and renders a real
          // white heading below instead, same pattern
          // NewClientInquiryDialog uses for its own on-dark Hero heading.
          visuallyHideTitle
          // Copies NewClientInquiryDialog's on-dark treatment (transparent
          // bg, white icon, translucent hover) but NOT its `relative z-50` --
          // that was specifically to beat a Hero image's own stacking
          // context, which doesn't apply to this dialog's plain dark
          // content; Dialog.tsx's own grid-based close-button placement is
          // already the correct baseline here.
          closeButtonClassName="bg-transparent text-white hover:bg-white/10 hover:text-white focus-visible:shadow-[inset_0_0_0_var(--semantic-control-border-width-active)_white]"
        >
          {favoriteAdvisors.length === 0 ? (
            <FavoritesEmptyState />
          ) : (
            <>
              {/* `text-center` + an extra 16px (`large`) of its own bottom
                margin on top of Content's own title-to-children gap, per
                the user. */}
              <h2 className="text-center text-[length:var(--semantic-content-subheading-font-size)] leading-[length:var(--semantic-content-subheading-line-height)] font-[number:var(--semantic-content-subheading-font-weight)] text-white mb-[var(--density-spacing-fixed-large)]">
                Comparing your favorited Financial Advisors:
              </h2>
              {/* No `flex-wrap` -- per the user, cards must never wrap onto
                additional rows. Instead each `FavoriteCard` is allowed to
                shrink below its natural 360px, down to its own 260px
                content floor (see `WIDTH_BY_VARIANT` in FavoriteCard.tsx),
                so up to `FAVORITES_CAP` (3) of them stay on one line
                within whatever width this Dialog actually has. The gap is
                flexible too (`clamp()`, floored at `large` (16px) instead
                of pinned to `xx-large` (24px), per the user) so it gives
                up some of its own width first, before the cards
                themselves need to shrink as much. `1.8vw` (not the more
                obvious `1vw`-per-token-px-ish rate) is deliberately
                calibrated, per the user, so the floor is actually reached
                by 768px -- this Dialog's narrowest real (desktop-still)
                viewport, `DESKTOP_QUERY` in Favorites.tsx, below which
                `FavoritesComparatorMobile` takes over entirely -- rather
                than just asymptotically approaching it without ever
                actually getting there. `vw`
                (not a container query unit) is deliberate here: this
                row's own available width already tracks the viewport
                near-1:1 (Dialog.Content's width is `100% - 2*padding` up
                to its own max-width cap), so a container query would need
                an extra wrapping element purely to establish containment
                for no real gain over reading the viewport directly.
                `min-w-0` undoes a real Dialog.Content grid-blowout bug
                fixed alongside this (see Dialog.tsx's own comment) that
                otherwise stopped this row from ever seeing its true
                available width to shrink against.
                `overflow-x-auto` is the fallback for whatever width still
                can't fit 3 cards at their own 260px floor plus 2 gaps at
                their own 16px floor -- confirmed live this is still
                reached at the comparator's narrowest real viewport
                (768px, `DESKTOP_QUERY` in Favorites.tsx) -- cards still
                never wrap,
                this row scrolls horizontally instead of clipping or
                forcing the Dialog itself wider than the viewport.
                `[justify-content:safe_center]` (an arbitrary property, no
                Tailwind `justify-safe-center` utility exists), not plain
                `justify-center` -- per the modern-web-guidance skill's own
                flexbox guidance, unprefixed `center` on an overflowing
                scroll container centers the content around a scroll
                position of 0 rather than the start of it, silently
                clipping the first card off-screen with no way to scroll
                to it; `safe` falls back to start-alignment specifically
                when the container is narrower than its content. Confirmed
                live that both classes present together silently lost
                (Tailwind's own `justify-center` utility cascades after
                arbitrary-property utilities regardless of source order in
                the class string) -- `justify-center` must stay out
                entirely, not just come first. */}
              <div className="flex min-w-0 flex-nowrap items-stretch [justify-content:safe_center] gap-[clamp(var(--density-spacing-fixed-large),1.8vw,var(--density-spacing-fixed-xx-large))] overflow-x-auto">
                {favoriteAdvisors.map(({ advisor, location }) => (
                  <FavoriteCard
                    key={advisor.id}
                    advisor={advisor}
                    location={location}
                    onOpenInquiry={setInquiryAdvisor}
                  />
                ))}
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Root>
      {inquiryAdvisor && (
        <NewClientInquiryDialog
          advisor={inquiryAdvisor}
          open
          onOpenChange={(open) => {
            if (!open) setInquiryAdvisor(null);
          }}
        />
      )}
    </>
  );
}
