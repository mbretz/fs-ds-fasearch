import { createBrowserRouter } from 'react-router-dom';
import { SiteShell } from './host-template/SiteShell';
import { routeChildren } from './routes';

export const router = createBrowserRouter([
  {
    element: <SiteShell />,
    children: routeChildren,
  },
]);
