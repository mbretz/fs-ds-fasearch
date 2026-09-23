import { useState } from 'react';
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
          style={{
            maxWidth: `calc(${cardsWidthPx}px + 2*var(--component-dialog-spacing-padding) + 2*var(--component-dialog-border-width) + ${SCROLLBAR_SAFETY_PX}px)`,
          }}
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
              {/* `flex-wrap` + `justify-center` -- when the dialog can't fit
                every card at its natural 360px width on one row, cards
                wrap onto additional rows instead of forcing the row (and
                the dialog) to scroll horizontally, per the user. */}
              <div className="flex flex-wrap items-stretch justify-center gap-[var(--density-spacing-fixed-xx-large)]">
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
