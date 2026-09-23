import { Dialog } from 'ds';
import type { Advisor, Location } from '../../data/locations';
import { FavoriteCard } from '../cards/FavoriteCard/FavoriteCard';
import { FavoritesEmptyState } from './FavoritesEmptyState';

export interface FavoritesComparatorDialogProps {
  favoriteAdvisors: { advisor: Advisor; location: Location }[];
  onOpenChange: (open: boolean) => void;
}

// Desktop host for `/favorites` -- matches Figma's "FA Scorecard" (node
// `1519:62263`), minus its "Back to Results" link (per the user, real nav
// exists elsewhere already). Modeled directly on
// `NewClientInquiryDialog.tsx`'s own `Dialog.Content` usage.
export function FavoritesComparatorDialog({
  favoriteAdvisors,
  onOpenChange,
}: FavoritesComparatorDialogProps) {
  return (
    <Dialog.Root open onOpenChange={onOpenChange}>
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
        className="max-w-[calc(3*379px+2*24px+2*var(--component-dialog-spacing-padding))] bg-[color:var(--color-response-neutral-strong)]"
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
            <h2 className="text-[length:var(--semantic-content-subheading-font-size)] leading-[length:var(--semantic-content-subheading-line-height)] font-[number:var(--semantic-content-subheading-font-weight)] text-white">
              Comparing your favorited Financial Advisors:
            </h2>
            <div className="flex items-stretch gap-[var(--density-spacing-fixed-xx-large)]">
              {favoriteAdvisors.map(({ advisor, location }) => (
                <FavoriteCard
                  key={advisor.id}
                  advisor={advisor}
                  location={location}
                />
              ))}
            </div>
          </>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
}
