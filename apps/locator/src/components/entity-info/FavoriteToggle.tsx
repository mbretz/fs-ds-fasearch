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
  /** Figma's "Favorite Action" component set (node 1302:48177) has a
   * "Device" variant that changes more than just size -- 'compact' (the
   * default, matching its Mobile variant) is the short "Favorite"/
   * "Favorited" microcopy this component originally shipped with;
   * 'expanded' (its Desktop variant) is a full sentence instead --
   * "Add to your Favorites" when idle, or "In your Favorites" (plain
   * text, not a link) plus a separate underlined "Remove" when favorited.
   * Ignored when showLabel is false. */
  variant?: 'compact' | 'expanded';
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
  variant = 'compact',
  className,
}: FavoriteToggleProps) {
  const [favorited, setFavorited] = useState(defaultFavorited);
  const toggle = () => setFavorited((prev) => !prev);
  const unfavoriteLabel = `Remove ${name} from favorites`;

  // Expanded + favorited (Figma's Favorited=True, Device=Desktop) is two
  // independent controls, not one -- per the user, clicking the heart icon
  // OR the "Remove" text must each unfavorite on their own, rather than the
  // whole row acting as a single click target the way every other
  // state/variant combination below still does (each of those has only one
  // possible action -- "add" -- so one wide click target is correct there,
  // matching this component's original single-button behavior).
  if (showLabel && variant === 'expanded' && favorited) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-[var(--density-spacing-fixed-x-small)] text-[color:var(--semantic-control-action-color-default)]',
          className,
        )}
      >
        <button
          type="button"
          aria-pressed={favorited}
          aria-label={unfavoriteLabel}
          onClick={toggle}
          className="inline-flex cursor-pointer items-center justify-center rounded-full"
        >
          <HeartFilled
            aria-hidden="true"
            className="size-[var(--density-sizing-fixed-x-large)]"
          />
        </button>
        <span className="text-[18px] leading-[1.5em] font-medium text-[color:var(--semantic-content-common-text-color-default)]">
          In your Favorites
        </span>
        <button
          type="button"
          aria-label={unfavoriteLabel}
          onClick={toggle}
          className="cursor-pointer text-[18px] leading-[1.5em] font-medium underline"
        >
          Remove
        </button>
      </span>
    );
  }

  const Icon = favorited ? HeartFilled : Heart;

  return (
    <button
      type="button"
      aria-pressed={favorited}
      aria-label={favorited ? unfavoriteLabel : `Add ${name} to favorites`}
      onClick={toggle}
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
      {showLabel &&
        (variant === 'expanded' ? (
          <span className="text-[18px] leading-[1.5em] font-medium underline">
            Add to your Favorites
          </span>
        ) : (
          <span className="text-[length:var(--semantic-content-microcopy-font-size)] leading-[length:var(--semantic-content-microcopy-line-height)]">
            {favorited ? 'Favorited' : 'Favorite'}
          </span>
        ))}
    </button>
  );
}
