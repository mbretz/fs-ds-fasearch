import { useState } from 'react';
import { Heart, HeartFilled } from 'icons';
import { cn } from '../../utils/cn';

export interface FavoriteToggleProps {
  /** The advisor/location's display name, used to build the accessible name. */
  name: string;
  defaultFavorited?: boolean;
  /** Renders a visible "Favorite" text label next to the icon -- Figma's
   * Hero "Favorite Action" instance, unlike the icon-only card treatment. */
  showLabel?: boolean;
  className?: string;
}

// Visual-only for this pass (confirmed with the user): local component
// state, no persistence, no SessionContext changes. Wiring this to real
// favorites state is left for the future Saved Advisors page work, same
// as ProspectPortal's "Go to Portal"/"Learn More" staying inert until
// their real destinations exist.
export function FavoriteToggle({
  name,
  defaultFavorited = false,
  showLabel,
  className,
}: FavoriteToggleProps) {
  const [favorited, setFavorited] = useState(defaultFavorited);
  const Icon = favorited ? HeartFilled : Heart;

  return (
    <button
      type="button"
      aria-pressed={favorited}
      aria-label={
        favorited ? `Remove ${name} from favorites` : `Add ${name} to favorites`
      }
      onClick={() => setFavorited((prev) => !prev)}
      className={cn(
        'inline-flex cursor-pointer items-center rounded-full text-[color:var(--semantic-control-action-color-default)]',
        showLabel
          ? 'gap-[var(--density-spacing-fixed-x-small)]'
          : 'justify-center',
        className,
      )}
    >
      <Icon
        aria-hidden="true"
        className="size-[var(--density-sizing-fixed-x-large)]"
      />
      {showLabel && (
        <span className="text-[length:var(--semantic-content-microcopy-font-size)] leading-[length:var(--semantic-content-microcopy-line-height)]">
          {favorited ? 'Favorited' : 'Favorite'}
        </span>
      )}
    </button>
  );
}
