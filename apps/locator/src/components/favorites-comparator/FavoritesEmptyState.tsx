import { cn } from '../../utils/cn';

export interface FavoritesEmptyStateProps {
  /** Dark-surface heading/body copy on both hosts (Dialog and mobile page
   * share the same #323334 background), so this never needs a light
   * variant of its own. */
  className?: string;
}

// Shared by `FavoritesComparatorDialog` and `FavoritesComparatorMobile` --
// no Figma spec covers the 0-favorites case, so this is a minimal,
// consistent stand-in for both hosts rather than two bespoke messages.
export function FavoritesEmptyState({ className }: FavoritesEmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-[var(--density-spacing-fixed-large)] py-[var(--density-spacing-fixed-xxx-large)] text-center',
        className,
      )}
    >
      <p className="text-[length:var(--semantic-content-common-font-size)] leading-[length:var(--semantic-content-common-line-height)] text-white">
        You haven&apos;t favorited any advisors yet.
      </p>
      <a
        href="/search"
        className="text-[length:var(--semantic-content-common-font-size)] leading-[length:var(--semantic-content-common-line-height)] font-medium text-white underline"
      >
        Back to search
      </a>
    </div>
  );
}
