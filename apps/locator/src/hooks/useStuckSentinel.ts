import { useEffect, useRef, useState } from 'react';

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
 */
export function useStuckSentinel(stickyOffsetPx = 0) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { rootMargin: `-${stickyOffsetPx + 1}px 0px 0px 0px`, threshold: [1] },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [stickyOffsetPx]);

  return { sentinelRef, stuck };
}
