import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { useSession } from '../session/useSession';
import {
  FAVORITES_CAP,
  type FavoritesContextValue,
} from './FavoritesContext.types';

// Versioned so a future shape change (e.g. storing more than an id per
// favorite) can migrate/ignore this key rather than crash on old data.
const STORAGE_KEY = 'locator.favorites.v1';

function readStoredFavorites(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === 'string')
      : [];
  } catch {
    return [];
  }
}

export const FavoritesContext = createContext<FavoritesContextValue | null>(
  null,
);

// Persists to localStorage (docs/PLAN.md item 7) -- separate from
// `SessionContext`, which is deliberately in-memory-only (see its own
// comment), since favorites needs a different persistence model
// entirely. Nested inside `SessionProvider` in App.tsx so it can read
// `signedIn` to clear favorites on sign-out.
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { signedIn } = useSession();
  const [favoriteIds, setFavoriteIds] = useState<string[]>(readStoredFavorites);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
    } catch {
      // Best-effort persistence -- a full/blocked localStorage shouldn't
      // break the in-memory favorites experience for this session.
    }
  }, [favoriteIds]);

  // Cleared on an actual sign-OUT transition per docs/PLAN.md item 7 --
  // there's no real multi-user auth here, so favorites belong to "the
  // current spoofed session," not the browser indefinitely. Tracks the
  // previous `signedIn` value via a ref rather than clearing whenever
  // `signedIn` is merely false -- confirmed live: `SessionContext` always
  // starts a fresh page load signed OUT (it's deliberately in-memory
  // only, see its own comment), so a plain `if (!signedIn)` fired on
  // this provider's very first mount too, wiping every localStorage-
  // persisted favorite on every reload before the user ever got a
  // chance to sign back in.
  const wasSignedIn = useRef(signedIn);
  useEffect(() => {
    if (wasSignedIn.current && !signedIn) setFavoriteIds([]);
    wasSignedIn.current = signedIn;
  }, [signedIn]);

  const isFavorite = useCallback(
    (advisorId: string) => favoriteIds.includes(advisorId),
    [favoriteIds],
  );

  // A plain (non-functional) `setFavoriteIds` call based on `favoriteIds`
  // from this render's closure, not a `setFavoriteIds((prev) => ...)`
  // updater with a side-effecting outer `result` variable -- confirmed
  // live: React 18 StrictMode double-invokes updater FUNCTIONS in dev (to
  // catch exactly this kind of impurity), which made this component's
  // returned result unreliable (observed reporting 'added' for a click
  // that correctly left the actual capped state untouched). Depending on
  // `favoriteIds` here instead sidesteps that entirely -- this callback's
  // identity changes each time favoriteIds does, which `value`'s own
  // `useMemo` below already accounts for.
  const toggleFavorite = useCallback(
    (advisorId: string) => {
      if (favoriteIds.includes(advisorId)) {
        setFavoriteIds(favoriteIds.filter((id) => id !== advisorId));
        return 'removed' as const;
      }
      if (favoriteIds.length >= FAVORITES_CAP) {
        return 'at-cap' as const;
      }
      setFavoriteIds([...favoriteIds, advisorId]);
      return 'added' as const;
    },
    [favoriteIds],
  );

  const value = useMemo(
    () => ({ favoriteIds, isFavorite, toggleFavorite }),
    [favoriteIds, isFavorite, toggleFavorite],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}
