import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../favorites/useFavorites';
import { findAdvisorById } from '../utils/findAdvisor';
import { useMediaQuery } from '../utils/useMediaQuery';
import { FavoritesComparatorDialog } from '../components/favorites-comparator/FavoritesComparatorDialog';
import { FavoritesComparatorMobile } from '../components/favorites-comparator/FavoritesComparatorMobile';

// 768px matches SiteHeader.tsx's own documented `md` breakpoint -- reusing
// that same number rather than introducing a second real breakpoint value.
const DESKTOP_QUERY = '(min-width: 768px)';

export function Favorites() {
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const navigate = useNavigate();
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

  return <FavoritesComparatorMobile favoriteAdvisors={favoriteAdvisors} />;
}
