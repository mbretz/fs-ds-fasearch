import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

/**
 * Detects whether a `position: sticky` element is currently stuck, so a
 * caller can swap in a shrunk/collapsed rendering while it's pinned (the
 * mobile hero's Expanded->Collapsed transition).
 *
 * Uses a 0-height sentinel placed immediately above the sticky element
 * (per `sentinelRef`) + IntersectionObserver, rather than CSS `@container
 * scroll-state(stuck:)` -- that query is Chrome/Edge-133+ only per the
 * modern-web-guidance skill, not Baseline Widely Available (this repo's
 * browser policy), and the visual change here (buttons appear, layout
 * shrinks) is load-bearing enough to need real Firefox/Safari support,
 * not just a progressive enhancement.
 *
 * `viewTransition` (default false) -- opt-in, not unconditional, per the
 * user: LocationHero.tsx shares this hook but doesn't (yet) declare any
 * `view-transition-name` pairs of its own, and firing an unnamed
 * transition still runs the UA's default whole-page crossfade, which the
 * user explicitly didn't want for AdvisorHero's own Expanded<->Collapsed
 * swap -- see AdvisorHero.tsx's own comment for the named-pair setup this
 * flag pairs with. `flushSync` mirrors Results.tsx's own local-state view
 * transition (its `changeView`) -- required so `setStuck`'s DOM update
 * happens synchronously inside `startViewTransition`'s callback, which the
 * API needs to snapshot the real "after" state rather than the same
 * (still-old) DOM twice. Feature-detected; unsupported browsers, and
 * `viewTransition: false` callers, just get the plain instant `setStuck`
 * this hook always used. `prefers-reduced-motion` is already handled
 * globally, not repeated here -- see apps/locator/src/view-transitions.css.
 *
 * `data-stuck-transition-direction` ("stuck"/"unstuck") on `<html>` --
 * same reasoning as Results.tsx's own `data-results-transition-direction`
 * (see its comment): `::view-transition-*` pseudo-elements are rooted on
 * `document`, not any regular DOM node, so a per-direction CSS override
 * (e.g. view-transitions.css's own stagger on AdvisorHero's background
 * bar, which only reads right when collapsing -- see that file's comment)
 * needs an ancestor attribute to key off, not component state. Set right
 * before the transition starts and removed once it's `finished`, so it
 * can't leak into some later, unrelated transition elsewhere in the app.
 */
export function useStuckSentinel(stickyOffsetPx = 0, viewTransition = false) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const next = !entry.isIntersecting;
        if (viewTransition && document.startViewTransition) {
          document.documentElement.dataset.stuckTransitionDirection = next
            ? 'stuck'
            : 'unstuck';
          const transition = document.startViewTransition(() =>
            flushSync(() => setStuck(next)),
          );
          transition.finished.finally(() => {
            delete document.documentElement.dataset.stuckTransitionDirection;
          });
        } else {
          setStuck(next);
        }
      },
      { rootMargin: `-${stickyOffsetPx + 1}px 0px 0px 0px`, threshold: [1] },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [stickyOffsetPx, viewTransition]);

  return { sentinelRef, stuck };
}
