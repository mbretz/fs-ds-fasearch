import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AdvisorSearchModule } from '../components/AdvisorSearchModule/AdvisorSearchModule';
import { InProgress } from '../components/AdvisorSearchModule/InProgress';
import { ResultsList } from '../components/ResultsList/ResultsList';
import { useFilteredLocations } from '../components/ResultsList/useFilteredLocations';
import { ProspectPortal } from '../components/ProspectPortal/ProspectPortal';

// query/selectedFocusAreas/acceptingNewClients live here, not inside
// InProgress.tsx -- InProgress (the search field, FilterMenu, Checkbox)
// and ResultsList (this page's other direct child, below) both need the
// same filter state, and a page component handing the same state down to
// its own direct children is plain lifted state, not a Context candidate
// (see InProgress.tsx's own comment for the reasoning).
export function Results() {
  // Seeded from the `q` URL param Start.tsx's submit handler navigates
  // here with, so a picked suggestion (or a typed-and-submitted query)
  // carries over into this stage's field instead of resetting to empty —
  // the URL, not a shared context, is what persists it across the route
  // change (these are two separate page components, not a state a
  // context could hand off between without one already having been
  // mounted to provide it).
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '');
  const [selectedFocusAreas, setSelectedFocusAreas] = useState<string[]>([]);
  const [acceptingNewClients, setAcceptingNewClients] = useState(false);

  const filteredLocations = useFilteredLocations(
    query,
    selectedFocusAreas,
    acceptingNewClients,
  );

  function submitSearch(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    setSearchParams({ q: trimmed });
  }

  return (
    <>
      <AdvisorSearchModule>
        <InProgress
          query={query}
          onQueryChange={setQuery}
          onSubmitSearch={submitSearch}
          selectedFocusAreas={selectedFocusAreas}
          onSelectedFocusAreasChange={setSelectedFocusAreas}
          acceptingNewClients={acceptingNewClients}
          onAcceptingNewClientsChange={setAcceptingNewClients}
        />
      </AdvisorSearchModule>
      {/*
        16px below AdvisorSearchModule (layout.fixed.large, the page-level
        spacing scale — see SiteShell.tsx's own comment on the
        spacing/layout tier split).

        Horizontal inset is a single fluid `clamp()` covering the whole
        range rather than a breakpoint jump, per the modern-web-guidance
        skill's fluid-scaling guide (a plain vw-based ramp here, not
        container query units, since this margin is keyed to the same
        viewport breakpoints SiteShell.tsx's own `<main>` padding already
        uses — 768px/`md`, 1262px — not to this component's own box): a
        16px-equivalent floor (`layout.fixed.large`, same token as the
        margin-top above) below/at 768px viewport, ramping linearly up to
        88px of additional inset (on top of `<main>`'s own 24px tablet
        padding) by 1262px (SiteShell's own breakpoint into its fixed
        1214px desktop column), then flat at 88px above that. `clamp()`'s
        own min/max bounds do the flattening at both ends, so no extra
        breakpoint prefixes are needed. The ramp's own zero-crossing
        (where the calc'd value would drop below the 16px floor) lands at
        ~858px, not 768px — viewport<858 clamps up to the 16px floor,
        858-1262 ramps 16px->88px, >1262 clamps down to 88px.
        88/(1262-768) = 88/494.

        A `max-[768px]:w-fit` (content-driven, non-stretching) mobile
        variant was tried and reverted: a wrapping flex container's
        intrinsic width is computed by browsers as if wrapping were
        disabled (a documented Flexbox spec quirk, confirmed empirically
        here by force-testing widths well below what the box actually
        rendered at, with zero overflow at any width tested), so
        `w-fit` doesn't shrink to the wrapped rows' own width — it just
        claims the full available width up to whatever cap bounds it,
        which produced real dead space when the widest wrapped row
        happened to be narrower than that cap (a hard, content-shape-
        dependent artifact, not fixable by adjusting flex-shrink). This
        single fluid `clamp()` margin sidesteps that entirely: the box
        always stretches (no `w-fit`), so its width is a designed value
        by definition rather than something meant to hug wrapped
        content, and there's nothing to mismatch.

        Above 360px viewport, the component's width is additionally
        capped to 80% of the viewport. Expressed as an extra margin
        floor rather than a separate `max-width`: a `max-width` sharing
        a box with two already-fixed (non-auto) margins is a classic
        over-constrained case (CSS 2.1 §10.3.3) — the browser would
        silently discard the specified *right* margin to make the math
        work, anchoring the box to the left instead of keeping it
        centered. Converting "width <= 80vw" into its equivalent margin
        ("margin >= 10vw" each side, since width = 100% - 2*margin) and
        taking whichever margin is larger (this floor or the fluid ramp
        above) keeps every case expressed as a single symmetric
        `margin-inline` value, so it's never over-constrained and always
        stays centered. Scoped to `min-[360px]:` (not applied below it)
        since 10vw already exceeds the 16px floor for any viewport
        wider than 160px — leaving it unscoped would silently replace
        this file's whole hand-tuned 16px->88px ramp with a flat "10% of
        viewport" margin almost everywhere above the very smallest
        phones, which isn't what was asked for here.
      */}
      <ProspectPortal
        className="
          mt-[var(--density-layout-fixed-large)]
          mx-[clamp(var(--density-layout-fixed-large),calc((100vw-768px)*88/494),88px)]
          min-[360px]:mx-[max(clamp(var(--density-layout-fixed-large),calc((100vw-768px)*88/494),88px),10vw)]
        "
      />
      <ResultsList locations={filteredLocations} />
    </>
  );
}
