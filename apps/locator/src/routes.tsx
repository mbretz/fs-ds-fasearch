import type { RouteObject } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Results } from './pages/Results';
import { AdvisorProfile } from './pages/AdvisorProfile';
import { AdvisorInquiry } from './pages/AdvisorInquiry';
import { LocationProfile } from './pages/LocationProfile';
import { Favorites } from './pages/Favorites';

// Pulled out of `router.tsx` (rather than inlined into its
// `createBrowserRouter` call, as it originally was) so `SiteShell.tsx`
// can reuse the exact same route table for its own second, independent
// `useRoutes()` match -- per the user, 2026-09-25: desktop's
// `/favorites` navigation now renders `FavoritesComparatorDialog` as a
// real overlay on top of whichever page launched it (matching the
// standard React Router "modal route" pattern -- a `state.
// backgroundLocation` carried on the navigation, matched against this
// same route table a second time by `SiteShell` to render that origin
// page *behind* the Dialog) instead of navigating away to a page that
// renders only the Dialog with nothing behind it. `router.tsx` itself
// still owns the one real `createBrowserRouter` instance/`SiteShell`
// wrapping -- this file is just the shared leaf route list, not a
// second router.
export const routeChildren: RouteObject[] = [
  { path: '/', element: <Landing /> },
  { path: '/search', element: <Results /> },
  { path: '/advisor/:id', element: <AdvisorProfile /> },
  { path: '/advisor/:id/inquiry', element: <AdvisorInquiry /> },
  { path: '/branch/:id', element: <LocationProfile /> },
  { path: '/favorites', element: <Favorites /> },
];
