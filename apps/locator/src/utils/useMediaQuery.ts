import { useEffect, useState } from 'react';

// New to this app -- every other responsive split so far uses container
// queries (CLAUDE.md's container-query-first convention), but the
// desktop/mobile split this backs (Favorites.tsx) has to decide BEFORE
// rendering whether to mount a Dialog at all: Dialog.Content is portal-
// rendered to document.body, so a CSS-only `hidden md:block` wrapper
// around it wouldn't stop the portaled scrim/content from painting
// full-screen on mobile regardless of the wrapper's own display.
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const listener = () => setMatches(mediaQueryList.matches);
    listener();
    mediaQueryList.addEventListener('change', listener);
    return () => mediaQueryList.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
