import 'ds/src/theme.css';
import './view-transitions.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { SessionProvider } from './session/SessionContext';
import { FavoritesProvider } from './favorites/FavoritesContext';

export function App() {
  return (
    <SessionProvider>
      <FavoritesProvider>
        <RouterProvider router={router} />
      </FavoritesProvider>
    </SessionProvider>
  );
}
