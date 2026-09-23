import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'icons';
import { Link } from 'ds';
import type { Advisor, Location } from '../../data/locations';
import { FavoriteCard } from '../cards/FavoriteCard/FavoriteCard';
import { FavoritesEmptyState } from './FavoritesEmptyState';
import { cn } from '../../utils/cn';

export interface FavoritesComparatorMobileProps {
  favoriteAdvisors: { advisor: Advisor; location: Location }[];
  /** The page that linked here -- see `Favorites.tsx`'s own `backLabel`
   * derivation (`?from=` query param, defaulting to "Results"). */
  backLabel: string;
  /** Real browser-history back, not a hardcoded route -- per the user,
   * this should return to whichever page actually launched the favorites
   * view (Results, or either profile page), not always the same one. */
  onBack: () => void;
}

// Mobile host for `/favorites` -- matches Figma's "Card-Favorite-Mobile"
// (node `1345:13549`), including its per-slide nav bar (between the name
// and card body) -- see `FavoriteCard`'s `nav` prop for how that's kept
// to a single real (non-duplicated) control despite being passed to every
// slide.
export function FavoritesComparatorMobile({
  favoriteAdvisors,
  backLabel,
  onBack,
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
    if (!slide) return;
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    // `scrollIntoView` (even with `block: 'nearest'`) walks up and can
    // still scroll ANCESTOR scrollports, including the page itself, which
    // is what caused the vertical jump-to-top-of-avatar bug. Scrolling
    // the horizontal scroller's own `scrollLeft` directly touches only
    // this carousel, never the page's vertical scroll position. Each
    // slide is exactly the scroller's visible width, so its `offsetLeft`
    // is already the correct centered `scrollLeft`.
    scroller.scrollTo({
      left: slide.offsetLeft,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    // Figma's dark background (`#323334`) is `color-response-neutral-
    // strong`, same token AdvisorHero's own dark banner uses -- no
    // hardcoded hex, per this repo's token-fallback convention.
    <div className="flex min-h-dvh flex-col gap-[var(--density-spacing-fixed-large)] bg-[color:var(--color-response-neutral-strong)] pt-[var(--density-spacing-fixed-large)] pb-[var(--density-spacing-fixed-xx-large)]">
      {/* `Link asChild` + a plain `<button>` -- same pattern
          ProspectPortalLite's own "Sign Out" uses -- since this is real
          browser-history navigation (`onBack`), not an `href` to a fixed
          route. White text (`text-reverse`), same reasoning as the name
          text on `FavoriteCard` -- this renders on the same dark scrim. */}
      <Link
        asChild
        className="self-start px-[var(--density-spacing-fixed-large)] text-[color:var(--semantic-content-common-text-color-reverse)]"
      >
        <button type="button" onClick={onBack}>
          <ChevronLeft
            aria-hidden
            className="mr-[var(--density-spacing-fixed-x-small)] inline-block size-[16px] align-text-bottom"
          />
          Back to {backLabel}
        </button>
      </Link>
      <h1 className="px-[var(--density-spacing-fixed-large)] text-center text-[length:var(--semantic-content-heavy-font-size)] leading-[length:var(--semantic-content-heavy-line-height)] font-[number:var(--semantic-content-heavy-font-weight)] text-white">
        Comparing your favorited
        <br />
        Financial Advisors:
      </h1>
      {favoriteAdvisors.length === 0 ? (
        <FavoritesEmptyState />
      ) : (
        <div
          ref={scrollerRef}
          // Hidden scrollbar: `scrollbar-width` (Newly, not yet Widely,
          // Available per modern-web-guidance's scrollbar guide) plus a
          // `::-webkit-scrollbar` fallback for engines that don't honor
          // it yet -- this carousel is nav-arrow/dot driven, so the
          // native scrollbar is redundant UI, not a required affordance.
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] motion-reduce:scroll-auto [&::-webkit-scrollbar]:hidden"
        >
          {favoriteAdvisors.map(({ advisor, location }, index) => {
            const isActive = index === activeIndex;
            return (
              // Each slide is the scroller's full viewport width (not the
              // card's own 358px) so exactly one card is ever visible --
              // the card itself just centers inside that full-width
              // slide. A gap or narrower slide here would let the
              // neighboring card's edge peek into view, which is the bug
              // this fixes.
              <div
                key={advisor.id}
                className="flex w-full shrink-0 snap-center justify-center"
              >
                <FavoriteCard
                  advisor={advisor}
                  location={location}
                  variant="mobile"
                  nav={
                    // Per the user, the nav lives between the name and
                    // the card body, i.e. inside each card slide -- but
                    // it must only be a REAL, single control, not N
                    // duplicate tab-stops. Every slide renders identical
                    // nav markup (so it's already in the right spot no
                    // matter which slide is snapped/visible), and `inert`
                    // strips every copy but the active slide's out of the
                    // tab order and accessibility tree entirely (not just
                    // visually hidden -- also blocks clicks on the
                    // clipped-offscreen copies).
                    <nav
                      aria-label="Favorited advisors"
                      aria-hidden={!isActive}
                      inert={!isActive}
                      className="flex items-center justify-center gap-[var(--density-spacing-fixed-large)]"
                    >
                      <button
                        type="button"
                        aria-label="Previous advisor"
                        onClick={() => {
                          if (activeIndex === 0) return;
                          scrollToIndex(activeIndex - 1);
                        }}
                        // `aria-disabled`, not `disabled` -- a *focused*
                        // button that goes `disabled` on the same click
                        // that reaches this boundary loses focus, and the
                        // browser's default focus repair jumps the page
                        // to the document's top (the "Comparing..."
                        // heading). `aria-disabled` keeps the button
                        // focusable while the guarded onClick above makes
                        // it a no-op.
                        aria-disabled={activeIndex === 0}
                        className="cursor-pointer text-white aria-disabled:cursor-not-allowed aria-disabled:opacity-40"
                      >
                        <ChevronLeft aria-hidden className="size-[24px]" />
                      </button>
                      <div
                        role="tablist"
                        className="flex items-center gap-[12px]"
                      >
                        {favoriteAdvisors.map(({ advisor: a }, dotIndex) => (
                          <button
                            key={a.id}
                            type="button"
                            role="tab"
                            aria-label={`Go to ${a.firstName} ${a.lastName}`}
                            aria-current={
                              dotIndex === activeIndex ? 'location' : undefined
                            }
                            onClick={() => scrollToIndex(dotIndex)}
                            // Figma's dot colors (`#28A4E2` active /
                            // `#979A9B` inactive) have no semantic-tier
                            // match -- primitives fallback
                            // (`blue-500`/`neutral-600`), per this repo's
                            // documented component -> semantic ->
                            // primitives order.
                            className={cn(
                              'size-[8px] cursor-pointer rounded-full',
                              dotIndex === activeIndex
                                ? 'bg-[color:var(--primitives-ref-color-blue-500)]'
                                : 'bg-[color:var(--primitives-ref-color-neutral-600)]',
                            )}
                          />
                        ))}
                      </div>
                      <button
                        type="button"
                        aria-label="Next advisor"
                        onClick={() => {
                          if (activeIndex === favoriteAdvisors.length - 1)
                            return;
                          scrollToIndex(activeIndex + 1);
                        }}
                        aria-disabled={
                          activeIndex === favoriteAdvisors.length - 1
                        }
                        className="cursor-pointer text-white aria-disabled:cursor-not-allowed aria-disabled:opacity-40"
                      >
                        <ChevronRight aria-hidden className="size-[24px]" />
                      </button>
                    </nav>
                  }
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
