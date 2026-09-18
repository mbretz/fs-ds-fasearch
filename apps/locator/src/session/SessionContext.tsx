import { createContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { SessionContextValue } from './SessionContext.types';

// Spoofed session per docs/PLAN.md item 6 — one hardcoded fake user, no
// credentials form, nothing to type. Lives in plain component state (not
// localStorage, unlike the favorites it will eventually gate): a fresh page
// load always starts signed out, matching a one-click demo toggle rather
// than a persisted login.
const FAKE_USER_FIRST_NAME = 'Jamie';
const FAKE_USER_LAST_NAME = 'Whitfield';

export const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [signedIn, setSignedIn] = useState(false);

  const value = useMemo(
    () => ({
      signedIn,
      firstName: FAKE_USER_FIRST_NAME,
      lastName: FAKE_USER_LAST_NAME,
      fullName: `${FAKE_USER_FIRST_NAME} ${FAKE_USER_LAST_NAME}`,
      signIn: () => setSignedIn(true),
      signOut: () => setSignedIn(false),
    }),
    [signedIn],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}
