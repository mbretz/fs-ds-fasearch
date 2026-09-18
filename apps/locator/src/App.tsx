import 'ds/src/theme.css';
import './view-transitions.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { SessionProvider } from './session/SessionContext';

export function App() {
  return (
    <SessionProvider>
      <RouterProvider router={router} />
    </SessionProvider>
  );
}
