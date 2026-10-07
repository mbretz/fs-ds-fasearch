import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Heart, HeartFilled } from 'icons';
import { cn } from '../../utils/cn';
import { useFavorites } from '../../favorites/useFavorites';
import { FAVORITES_CAP } from '../../favorites/FavoritesContext.types';

export interface FavoriteToggleProps {
  /** The id `useFavorites` keys favorited/unfavorited state on. */
  advisorId: string;
  /** The advisor/location's display name, used to build the accessible name. */
  name: string;
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

const CAP_ERROR_DURATION_MS = 3000;

export function FavoriteToggle({
  advisorId,
  name,
  showLabel,
  variant = 'compact',
  className,
}: FavoriteToggleProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(advisorId);
  const [capError, setCapError] = useState(false);
  const capErrorTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  // This component's own root `<span>` -- measured (below) to position
  // the portaled cap-error toast, since a plain CSS `absolute` toast
  // (this component's own original approach) gets silently clipped by
  // any ancestor with `overflow: hidden` between here and the page root.
  // Confirmed a real instance of that, 2026-09-28: `AdvisorHero.tsx`'s
  // own sign-in/out collapse animation wraps this whole component in
  // exactly such an ancestor (`overflow-hidden` is load-bearing there,
  // for the `block-size` collapse itself) -- the toast rendered
  // (confirmed via computed styles) but was never visible on either
  // desktop or mobile. `AdvisorCard`/`LocationCard`'s own usage never
  // hit this (no clipping ancestor there), which is why it went
  // unnoticed until reported on the profile page specifically.
  const anchorRef = useRef<HTMLSpanElement>(null);
  const [toastPosition, setToastPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  useEffect(() => () => clearTimeout(capErrorTimeoutRef.current), []);

  // Snapshots the anchor's position once, right when the toast opens --
  // not re-measured on scroll/resize while showing, same tradeoff every
  // other short-lived (3s), auto-dismissing toast in this app makes
  // (e.g. `PrototypeInfoTray`'s own fixed placement). `useLayoutEffect`,
  // not `useEffect`, so the very first paint of the toast already has
  // its real position -- an `useEffect` version would render one frame
  // at `(0, 0)` first, a visible jump.
  useLayoutEffect(() => {
    if (!capError || !anchorRef.current) {
      setToastPosition(null);
      return;
    }
    const rect = anchorRef.current.getBoundingClientRect();
    setToastPosition({ top: rect.bottom, left: rect.left });
  }, [capError]);

  const toggle = () => {
    const result = toggleFavorite(advisorId);
    clearTimeout(capErrorTimeoutRef.current);
    if (result === 'at-cap') {
      setCapError(true);
      capErrorTimeoutRef.current = setTimeout(
        () => setCapError(false),
        CAP_ERROR_DURATION_MS,
      );
    } else {
      setCapError(false);
    }
  };
  const unfavoriteLabel = `Remove ${name} from favorites`;

  // Rendered by both branches below -- the cap-exceeded message applies
  // regardless of which layout this toggle currently renders (favorited
  // state can't ever hit it, but the icon-only/expanded-idle branches can).
  // Portaled to `document.body` (not inline in this component's own tree)
  // and positioned via `toastPosition` (computed above) rather than a
  // plain CSS `absolute` -- see `anchorRef`'s own comment for why:
  // `absolute` gets silently clipped by a `overflow: hidden` ancestor
  // like `AdvisorHero.tsx`'s own collapse wrapper. `position: fixed`
  // (viewport-relative, matching `getBoundingClientRect()`'s own
  // coordinate space) is what lets it escape any such ancestor
  // regardless of where this component is ever mounted.
  const capErrorMessage =
    capError && toastPosition
      ? createPortal(
          <span
            role="status"
            // `border-critical bg-critical-subtle` -- same critical-variant
            // pairing Button.tsx's own `variant="critical"` already uses (see
            // its own `border-critical` class), reused here rather than
            // inventing a new critical treatment. `z-20` -- no dedicated
            // z-index-* scale entry exists for a card-level toast like this
            // (see theme.css's own overlay/modal/popover roles, none of
            // which fit), so a plain `z-20` is enough to beat this app's
            // own default z-auto stacking, per the user. Now portaled to
            // `document.body`, so this also has to clear that page's real
            // content, not just sibling cards in a grid.
            style={{
              top: toastPosition.top,
              left: toastPosition.left,
            }}
            className="z-index-popover fixed mt-[var(--density-spacing-fixed-x-small)] w-max max-w-[240px] rounded-[var(--semantic-border-radius-generous)] border-[length:var(--semantic-surface-border-width)] border-critical bg-critical-subtle px-[var(--density-spacing-fixed-med)] py-[var(--density-spacing-fixed-x-small)] text-[length:var(--semantic-content-microcopy-font-size)] leading-[length:var(--semantic-content-microcopy-line-height)] text-critical-strong"
          >
            You can only favorite up to {FAVORITES_CAP} advisors in this
            prototype
          </span>,
          document.body,
        )
      : null;

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
        ref={anchorRef}
        className={cn(
          'relative inline-flex items-center gap-[var(--density-spacing-fixed-x-small)] text-[color:var(--semantic-control-action-color-default)]',
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
        {capErrorMessage}
      </span>
    );
  }

  const Icon = favorited ? HeartFilled : Heart;

  return (
    <span ref={anchorRef} className={cn('relative inline-flex', className)}>
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
      {capErrorMessage}
    </span>
  );
}
