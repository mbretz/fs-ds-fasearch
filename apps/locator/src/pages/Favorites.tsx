import { useNavigate, useSearchParams } from 'react-router-dom';
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
  const [searchParams] = useSearchParams();
  const backLabel = searchParams.get('from') ?? DEFAULT_BACK_LABEL;
  const { favoriteIds } = useFavorites();
  const favoriteAdvisors = favoriteIds
    .map((id) => findAdvisorById(id))
    .filter((found): found is NonNullable<typeof found> => found !== undefined);

  if (isDesktop) {
    return (
      <FavoritesComparatorDialog
        favoriteAdvisors={favoriteAdvisors}
        onOpenChange={(open) => {
          if (!open) navigate('/search');
        }}
      />
    );
  }

  return (
    <FavoritesComparatorMobile
      favoriteAdvisors={favoriteAdvisors}
      backLabel={backLabel}
      onBack={() => navigate(-1)}
    />
  );
}
