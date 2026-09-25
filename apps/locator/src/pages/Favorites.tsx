import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useFavorites } from '../favorites/useFavorites';
import { findAdvisorById } from '../utils/findAdvisor';
import { useMediaQuery } from '../utils/useMediaQuery';
import { FavoritesComparatorDialog } from '../components/favorites-comparator/FavoritesComparatorDialog';
import { FavoritesComparatorMobile } from '../components/favorites-comparator/FavoritesComparatorMobile';

// 768px matches SiteHeader.tsx's own documented `md` breakpoint -- reusing
// that same number rather than introducing a second real breakpoint value.
const DESKTOP_QUERY = '(min-width: 768px)';

// Falls back to this when `?from=` is missing (e.g. `/favorites` entered
// directly) -- every real launcher (ProspectPortal on Results,
// ProspectPortalLite on the two profile pages) always sets it, see
// ProspectPortalLite.types.ts's own `favoritesFromLabel` comment.
const DEFAULT_BACK_LABEL = 'Results';

export function Favorites() {
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const backLabel = searchParams.get('from') ?? DEFAULT_BACK_LABEL;
  const { favoriteIds } = useFavorites();
  const favoriteAdvisors = favoriteIds
    .map((id) => findAdvisorById(id))
    .filter((found): found is NonNullable<typeof found> => found !== undefined);

  if (isDesktop) {
    // `location.state?.backgroundLocation` -- set by `ProspectPortal.tsx`'s/
    // `ProspectPortalLite.tsx`'s own `navigateToFavorites` (desktop
    // widths), per the user, 2026-09-25: this Dialog now opens as a real
    // overlay on whichever page launched it (`SiteShell.tsx`'s own
    // "modal route" `useRoutes()` match renders that page underneath),
    // so closing it should be a real history *back* (`navigate(-1)`) to
    // that SAME live page instance, not a fresh `navigate('/search')`
    // that would lose it (or land on the wrong page entirely, for an
    // advisor/location-launched visit). The old hardcoded `/search`
    // fallback is kept for the one case with no background state at all
    // -- landing on `/favorites` directly (e.g. a bookmarked/typed URL).
    const hasBackgroundLocation = Boolean(
      (location.state as { backgroundLocation?: unknown } | null)
        ?.backgroundLocation,
    );
    return (
      <FavoritesComparatorDialog
        favoriteAdvisors={favoriteAdvisors}
        onOpenChange={(open) => {
          if (open) return;
          if (hasBackgroundLocation) {
            navigate(-1);
          } else {
            navigate('/search');
          }
        }}
      />
    );
  }

  // `onBack` prefers a concrete `returnTo` path (`state`, set by
  // `ProspectPortalLite.tsx`'s/`ProspectPortal.tsx`'s own
  // `navigateToFavorites`) over `navigate(-1)` now -- per the user,
  // 2026-09-25: a history-delta navigation's own `popstate` always fires
  // asynchronously, never inside the same synchronous callback
  // `document.startViewTransition()` needs to capture the "new" DOM
  // from, so an earlier pass here that manually wrapped `navigate(-1)`
  // in `document.startViewTransition()` + `flushSync` (same precedent as
  // `Results.tsx`'s own `changeView`) never actually produced a real
  // transition -- it silently fell through to a plain, untransitioned
  // (and, per the user, sometimes hard-reloading) navigation instead.
  // With a concrete path, this can just use React Router's own
  // `viewTransition` navigate option directly, the same reliable
  // mechanism the *forward* direction already uses. `navigate(-1)`
  // remains the fallback for the one case `returnTo` can't cover --
  // landing on `/favorites` with no `state` at all (e.g. a direct URL
  // visit) -- untransitioned, same as before.
  function backWithSlide() {
    const returnTo = (location.state as { returnTo?: string } | null)?.returnTo;
    if (!returnTo) {
      navigate(-1);
      return;
    }
    document.documentElement.dataset.favoritesTransitionDirection = 'backward';
    navigate(returnTo, { viewTransition: true });
    window.setTimeout(() => {
      delete document.documentElement.dataset.favoritesTransitionDirection;
    }, 400);
  }

  return (
    <FavoritesComparatorMobile
      favoriteAdvisors={favoriteAdvisors}
      backLabel={backLabel}
      onBack={backWithSlide}
    />
  );
}
