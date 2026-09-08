import { createBrowserRouter } from 'react-router-dom';
import { SiteShell } from './host-template/SiteShell';
import { Landing } from './pages/Landing';
import { Results } from './pages/Results';

export const router = createBrowserRouter([
  {
    element: <SiteShell />,
    children: [
      { path: '/', element: <Landing /> },
      { path: '/search', element: <Results /> },
    ],
  },
]);
