import { createContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { SessionContextValue } from './SessionContext.types';

// Spoofed session per docs/PLAN.md item 6 — one hardcoded fake user, no
// credentials form, nothing to type.
const FAKE_USER_FIRST_NAME = 'Jamie';
const FAKE_USER_LAST_NAME = 'Whitfield';

// sessionStorage (not localStorage, unlike the favorites this gates) --
// per the user, 2026-09-23: every real navigation in this app is a plain
// `<a href>` full-page load (no client-side routing outside `useNavigate`'s
// own callers), which was silently signing a user back out on every click
// to a new page (View Profile, New Client Inquiry, the new Favorites
// launcher, etc) once real cross-page navigation from a signed-in-gated
// action existed. `sessionStorage` survives that reload while still
// resetting on an actual new browser tab/session, matching "signed in for
// this visit" rather than a real persisted login.
const STORAGE_KEY = 'locator.session.signedIn';

function readStoredSignedIn(): boolean {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [signedIn, setSignedIn] = useState(readStoredSignedIn);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, String(signedIn));
    } catch {
      // Best-effort -- a blocked sessionStorage just falls back to the
      // previous in-memory-only behavior for this session.
    }
  }, [signedIn]);

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
