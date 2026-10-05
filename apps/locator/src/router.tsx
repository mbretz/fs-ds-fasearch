import { createBrowserRouter } from 'react-router-dom';
import { SiteShell } from './host-template/SiteShell';
import { routeChildren } from './routes';

export const router = createBrowserRouter(
  [
    {
      element: <SiteShell />,
      children: routeChildren,
    },
  ],
  // '/' unless the build sets a base path (e.g. GitHub Pages project site).
  { basename: import.meta.env.BASE_URL },
);
