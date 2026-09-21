import { createBrowserRouter } from 'react-router-dom';
import { SiteShell } from './host-template/SiteShell';
import { Landing } from './pages/Landing';
import { Results } from './pages/Results';
import { AdvisorProfile } from './pages/AdvisorProfile';
import { LocationProfile } from './pages/LocationProfile';

export const router = createBrowserRouter([
  {
    element: <SiteShell />,
    children: [
      { path: '/', element: <Landing /> },
      { path: '/search', element: <Results /> },
      { path: '/advisor/:id', element: <AdvisorProfile /> },
      { path: '/branch/:id', element: <LocationProfile /> },
    ],
  },
]);
