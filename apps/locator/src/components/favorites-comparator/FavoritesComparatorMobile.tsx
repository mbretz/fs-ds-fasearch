import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'icons';
import type { Advisor, Location } from '../../data/locations';
import { FavoriteCard } from '../cards/FavoriteCard/FavoriteCard';
import { FavoritesEmptyState } from './FavoritesEmptyState';
import { cn } from '../../utils/cn';

export interface FavoritesComparatorMobileProps {
  favoriteAdvisors: { advisor: Advisor; location: Location }[];
}

// Mobile host for `/favorites` -- matches Figma's "Card-Favorite-Mobile"
// (node `1345:13549`). Figma repeats its dark heading+nav bar per-slide,
// but that's per-node Figma authoring, not a real design intent -- this
// renders it ONCE, above the scroller, synced to whichever slide is
// currently snapped.
export function FavoritesComparatorMobile({
  favoriteAdvisors,
}: FavoritesComparatorMobileProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Sync nav state to whichever slide is actually snapped -- per
  // modern-web-guidance's `scroll-snap-state-sync` guide. `scrollsnapchange`
  // is Chrome/Edge 129+ only (NOT Baseline Widely Available, unlike this
  // repo's usual no-fallback policy), so this app's IntersectionObserver
  // fallback below is required, not optional.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const slides = Array.from(scroller.children) as HTMLElement[];

    if ('onscrollsnapchange' in scroller) {
      const handleSnapChange = (event: Event) => {
        const target = (event as Event & { snapTargetInline?: Element })
          .snapTargetInline;
        if (!target) return;
        const index = slides.indexOf(target as HTMLElement);
        if (index !== -1) setActiveIndex(index);
      };
      scroller.addEventListener('scrollsnapchange', handleSnapChange);
      return () =>
        scroller.removeEventListener('scrollsnapchange', handleSnapChange);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries.reduce((best, entry) =>
          entry.intersectionRatio > best.intersectionRatio ? entry : best,
        );
        if (mostVisible.isIntersecting) {
          const index = slides.indexOf(mostVisible.target as HTMLElement);
          if (index !== -1) setActiveIndex(index);
        }
      },
      { root: scroller, threshold: 0.9 },
    );
    slides.forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, [favoriteAdvisors.length]);

  const scrollToIndex = (index: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const clamped = Math.max(0, Math.min(index, favoriteAdvisors.length - 1));
    const slide = scroller.children[clamped] as HTMLElement | undefined;
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    slide?.scrollIntoView({
      inline: 'center',
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    // Figma's dark background (`#323334`) is `color-response-neutral-
    // strong`, same token AdvisorHero's own dark banner uses -- no
    // hardcoded hex, per this repo's token-fallback convention.
    <div className="flex min-h-dvh flex-col gap-[var(--density-spacing-fixed-large)] bg-[color:var(--color-response-neutral-strong)] pt-[var(--density-spacing-fixed-large)] pb-[var(--density-spacing-fixed-xx-large)]">
      <h1 className="px-[var(--density-spacing-fixed-large)] text-center text-[length:var(--semantic-content-heavy-font-size)] leading-[length:var(--semantic-content-heavy-line-height)] font-[number:var(--semantic-content-heavy-font-weight)] text-white">
        Comparing your favorited
        <br />
        Financial Advisors:
      </h1>
      {favoriteAdvisors.length === 0 ? (
        <FavoritesEmptyState />
      ) : (
        <>
          <nav
            aria-label="Favorited advisors"
            className="flex items-center justify-center gap-[var(--density-spacing-fixed-large)]"
          >
            <button
              type="button"
              aria-label="Previous advisor"
              onClick={() => scrollToIndex(activeIndex - 1)}
              disabled={activeIndex === 0}
              className="cursor-pointer text-white disabled:opacity-40"
            >
              <ChevronLeft aria-hidden className="size-[24px]" />
            </button>
            <div role="tablist" className="flex items-center gap-[12px]">
              {favoriteAdvisors.map(({ advisor }, index) => (
                <button
                  key={advisor.id}
                  type="button"
                  role="tab"
                  aria-label={`Go to ${advisor.firstName} ${advisor.lastName}`}
                  aria-current={index === activeIndex ? 'location' : undefined}
                  onClick={() => scrollToIndex(index)}
                  // Figma's dot colors (`#28A4E2` active / `#979A9B`
                  // inactive) have no semantic-tier match -- primitives
                  // fallback (`blue-500`/`neutral-600`), per this repo's
                  // documented component -> semantic -> primitives order.
                  className={cn(
                    'size-[8px] cursor-pointer rounded-full',
                    index === activeIndex
                      ? 'bg-[color:var(--primitives-ref-color-blue-500)]'
                      : 'bg-[color:var(--primitives-ref-color-neutral-600)]',
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label="Next advisor"
              onClick={() => scrollToIndex(activeIndex + 1)}
              disabled={activeIndex === favoriteAdvisors.length - 1}
              className="cursor-pointer text-white disabled:opacity-40"
            >
              <ChevronRight aria-hidden className="size-[24px]" />
            </button>
          </nav>
          <div
            ref={scrollerRef}
            className="flex snap-x snap-proximity gap-[var(--density-spacing-fixed-large)] overflow-x-auto px-[var(--density-spacing-fixed-large)] motion-reduce:scroll-auto"
          >
            {favoriteAdvisors.map(({ advisor, location }) => (
              <div key={advisor.id} className="shrink-0 snap-center">
                <FavoriteCard
                  advisor={advisor}
                  location={location}
                  variant="mobile"
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
