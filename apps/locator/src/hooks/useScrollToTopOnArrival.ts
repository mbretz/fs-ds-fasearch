import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scrolls to the page top when this route was navigated to with
 * `state: { scrollToTop: true }` (set by `EntityActions`' primary link, i.e.
 * a Results card/pin popover -> its profile). Without it the profile opens at
 * whatever scroll offset the Results page was left at. `useLayoutEffect` so
 * it lands before React Router's view transition captures the new state;
 * `behavior: 'instant'` overrides the global `scroll-behavior: smooth`.
 */
export function useScrollToTopOnArrival() {
  const { state } = useLocation();
  useLayoutEffect(() => {
    if (!(state as { scrollToTop?: boolean } | null)?.scrollToTop) return;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [state]);
}
