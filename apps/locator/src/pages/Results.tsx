import { useCallback, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import { AdvisorSearchModule } from '../components/AdvisorSearchModule/AdvisorSearchModule';
import { InProgress } from '../components/AdvisorSearchModule/InProgress';
import { FilterFacets } from '../components/FilterFacets/FilterFacets';
import { ResultsList } from '../components/ResultsList/ResultsList';
import { useFilteredLocations } from '../components/ResultsList/useFilteredLocations';
import {
  ResultsToolbar,
  type ResultsView,
} from '../components/ResultsToolbar/ResultsToolbar';
import { ProspectPortal } from '../components/ProspectPortal/ProspectPortal';
import { Map as LocatorMap, type MapHandle } from '../components/Map';
import type { Location } from '../data/locations';

// Left-to-right order the SegmentedControl (desktop)/RadioGroup (mobile)
// buttons render in (see ResultsToolbar.tsx) -- `changeView`'s slide
// direction below walks this same order, so the transition always
// matches whichever side of the currently-selected button the user
// clicked.
const RESULTS_VIEW_ORDER: ResultsView[] = ['list', 'map', 'dual'];

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
  // Defaults to 'list' -- the only view with real content built out so
  // far (see ResultsToolbar.tsx) -- rather than docs/PLAN.md's eventual
  // "desktop defaults to Dual View", per the user, until Map/Dual exist.
  const [view, setView] = useState<ResultsView>('list');
  // Map/list<->map sync state (docs/PLAN.md §2.2): one `selectedLocationId`
  // drives both a highlighted/scrolled-to ResultsList row (Dual view) and
  // the matching pin's open popover (Map/Dual view) -- plain lifted state,
  // not a Context, same reasoning as `query`/`selectedFocusAreas` above.
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null,
  );
  // Clamps `window.scrollY` back down whenever a view switch shrinks the
  const mapRef = useRef<MapHandle>(null);
  // A plain object, not a `Map` instance -- `Map` is already this page's
  // own map-component import name (see above); a `Record` sidesteps that
  // collision entirely rather than aliasing one of the two.
  const itemRefsRef = useRef<Record<string, HTMLElement | null>>({});

  // `searchParams`'s `q` only ever changes inside `submitSearch` below (or a
  // typeahead pick, which routes through the same `onSubmit` path) -- never
  // on every keystroke of `query` itself. Passing this, not `query`, into
  // `useFilteredLocations` is what keeps the results grid from updating
  // until an explicit action happens (see that hook's own comment).
  const submittedQuery = searchParams.get('q') ?? '';
  const filteredLocations = useFilteredLocations(
    submittedQuery,
    selectedFocusAreas,
    acceptingNewClients,
  );
  // Every card ResultsList renders: one LocationCard per matching branch
  // plus one AdvisorCard per advisor at each of those branches, per the
  // user -- not just a location or advisor count alone.
  const resultsCount =
    filteredLocations.length +
    filteredLocations.reduce(
      (sum, location) => sum + location.advisors.length,
      0,
    );

  function submitSearch(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    setSearchParams({ q: trimmed });
  }

  const registerItemRef = useCallback((id: string, el: HTMLElement | null) => {
    itemRefsRef.current[id] = el;
  }, []);

  // List row click (Dual view) -> select + fly the map to it + open its
  // popover, per docs/PLAN.md §2.2's list->map sync.
  function handleListSelect(location: Location) {
    setSelectedLocationId(location.id);
    mapRef.current?.flyTo(location);
    mapRef.current?.setSelected(location.id);
  }

  // Pin click (or `MapPinPopover` closing) -> select/deselect + scroll
  // the matching list row into view, per §2.2's pin->list sync. Native
  // `Element.scrollIntoView()`, not a DS `ScrollArea` API -- confirmed
  // elsewhere in this codebase that's already the established pattern.
  // A no-op when the matching row isn't currently mounted (plain Map
  // view, no ResultsList rendered).
  const handlePinSelect = useCallback((id: string | null) => {
    setSelectedLocationId(id);
    if (id) {
      itemRefsRef.current[id]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, []);

  // Map/Dual each render at a real (roughly) fixed height now (Map.tsx's
  // own container className, ~432px mobile/600px desktop) -- an earlier
  // pass here tried to pre-compute and floor the results-content
  // wrapper's own `minHeight` at that value on every switch, to keep a
  // scrolled-down List position from getting stranded once the page
  // suddenly got shorter. Removed, per the user, 2026-09-24: it needed a
  // hardcoded height constant to match Map/Dual's real rendered height
  // exactly, and didn't actually fix the dead-space-below-the-footer bug
  // it was meant to prevent (see `clampScroll` below, which does).
  //
  // Clamps `window.scrollY` back down whenever a switch shrinks the page
  // shorter than the scroll position the user was already at -- the
  // browser doesn't do this on its own, so a scroll position from a tall
  // List view can end up past the end of a much shorter Dual/Map page,
  // leaving a real dead gap of blank canvas below the footer (confirmed
  // via devtools, per the user: every element up through the footer
  // measures correctly, so this was never a sizing bug). A no-op
  // whenever the current scroll position is already within the new
  // page's real scrollable range.
  function clampScroll() {
    const maxScrollY =
      document.documentElement.scrollHeight - window.innerHeight;
    if (window.scrollY > maxScrollY) {
      window.scrollTo({ top: Math.max(maxScrollY, 0) });
    }
  }

  function changeView(next: ResultsView) {
    function commit() {
      setView(next);
      // Map/Dual each mount their own separate `LocatorMap` instance
      // (see below) -- switching between them remounts a fresh map, but
      // `selectedLocationId` lives up here and carries straight over, so
      // the new instance immediately reopens that location's popover
      // against its own (different-sized/positioned) map, which reads as
      // the popover jumping to an unexpected spot. Closing it here on
      // every view change is simpler and more robust than trying to
      // preserve its on-screen position across two genuinely different
      // map instances, per the user.
      setSelectedLocationId(null);
    }

    // Wraps the view switch in `document.startViewTransition()` so the
    // results-content pane (below, `[view-transition-name:results-
    // content]`) slides left/right instead of hard-cutting -- same View
    // Transitions precedent as Start.tsx's own route change, except this
    // is a local state change, not a router navigation, so there's no
    // `viewTransition: true` router option to lean on; `flushSync` is
    // what makes `commit`'s DOM update happen synchronously inside the
    // callback, which `startViewTransition` requires in order to
    // capture the "new" state correctly rather than snapshotting the
    // same (still-old) DOM twice. Unsupported browsers (feature-detected
    // below) just get the instant switch. `prefers-reduced-motion` is
    // already handled globally, not repeated here -- see
    // apps/locator/src/view-transitions.css.
    //
    // Skipped entirely (same instant-switch fallback) whenever Dual is
    // either end of the switch -- per the user, 2026-09-24. Confirmed
    // via the browser console
    // (`document.documentElement.scrollHeight` vs. `document.body.
    // scrollHeight` diverging by tens of thousands of px -- real page
    // content ends around 1300px, but `<html>`'s own reported
    // scrollHeight was 23000+) that the "dead space below the footer"
    // bug is a stuck `::view-transition` pseudo-element tree left
    // behind by a Dual-involved switch: it renders outside `<body>` (so
    // it never shows up as an inspectable element, and doesn't affect
    // `body.scrollHeight`) but still counts toward `documentElement.
    // scrollHeight`, creating scrollable blank space no `clampScroll`
    // math can account for, since `scrollHeight` itself is inflated, not
    // just `scrollY`. Two earlier passes here (a stale height-
    // reservation floor, then various `clampScroll` timing/placement
    // attempts) chased scroll-position and content-height theories that
    // both turned out to be red herrings once this was actually
    // measured. Dual is the one destination that mounts a whole second
    // live component (a fresh `LocatorMap`/MapLibre GL instance)
    // alongside ResultsList inside the same `flushSync`, not just
    // swapping one for the other -- plausibly enough extra synchronous
    // work inside the transition's own update callback to leave the
    // browser's transition lifecycle in a state it doesn't clean up
    // from properly. Bypassing View Transitions for Dual sidesteps that
    // outright; List<->Map keeps its slide animation, only Dual loses
    // it. A stuck ghost from *before* this fix won't self-clear --
    // needs an actual page reload, not just further clicking around.
    if (!document.startViewTransition || next === 'dual' || view === 'dual') {
      commit();
      clampScroll();
      return;
    }

    // Read via `document.documentElement` (`<html>`), not `setState` --
    // the actual slide-direction CSS lives in view-transitions.css,
    // keyed off this same attribute, since `::view-transition-*`
    // pseudo-elements are rooted there rather than under any regular DOM
    // node this component renders (see that file's own comment).
    document.documentElement.dataset.resultsTransitionDirection =
      RESULTS_VIEW_ORDER.indexOf(next) > RESULTS_VIEW_ORDER.indexOf(view)
        ? 'forward'
        : 'backward';
    const transition = document.startViewTransition(() => {
      flushSync(commit);
    });
    // `clampScroll` runs here, not in a `useEffect` keyed on `view` (an
    // earlier pass here) -- per the user, 2026-09-24: an effect fires as
    // soon as React commits, which for the View Transition path is
    // *during* the ~300ms slide animation, before the browser's own
    // transition machinery has settled on the new layout. Running it
    // only once `finished` resolves is what actually stops the dead
    // space below the footer from showing up.
    transition.finished.finally(() => {
      delete document.documentElement.dataset.resultsTransitionDirection;
      clampScroll();
    });
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
      <FilterFacets
        selectedFocusAreas={selectedFocusAreas}
        onSelectedFocusAreasChange={setSelectedFocusAreas}
        className="mt-[var(--density-layout-fixed-large)]"
      />
      {/* Unlike ResultsList/AdvisorSearchModule/FilterFacets, this row
          keeps a flat 16px (`layout.fixed.large`) horizontal margin at
          every breakpoint instead of deferring to `<main>`'s own
          ambient padding at `md`+ (`mx-0`) -- per the user, this row
          should read as indented relative to the results grid and
          search module above it, not flush with their edges.

          Top margin is double every other gap on this page (`xxx-large`,
          32px -- exactly 2x `large`, 16px, rather than a `calc()`, per
          the user), so this row reads as its own section break from
          FilterFacets above it instead of stacking at the same rhythm as
          every other sibling gap here. */}
      <ResultsToolbar
        resultsCount={resultsCount}
        view={view}
        onViewChange={changeView}
        className="mx-[var(--density-layout-fixed-large)] mt-[var(--density-layout-fixed-xxx-large)]"
      />
      {/* `[view-transition-name:results-content]` scopes the cross-fade
          to just this region (not the whole page/header) -- see
          `changeView` above. */}
      {/* 8px (`spacing.fixed.small`) gap to ResultsToolbar above -- much
          tighter than every other gap on this page, per the user, so the
          toolbar reads as glued to the content it's controlling rather
          than stacking at the same rhythm as the section-level gaps
          elsewhere on this page. */}
      <div className="[view-transition-name:results-content]">
        {view === 'list' && (
          <ResultsList
            locations={filteredLocations}
            className="mt-[var(--density-spacing-fixed-small)]"
          />
        )}
        {view === 'map' && (
          <LocatorMap
            ref={mapRef}
            locations={filteredLocations}
            selectedLocationId={selectedLocationId}
            onPinSelect={handlePinSelect}
            className="mx-[var(--density-layout-fixed-large)] mt-[var(--density-spacing-fixed-small)] md:mx-0"
          />
        )}
        {/* Side by side at 920px+ (a custom `min-[920px]:` arbitrary
            variant, not a stock `md`/`lg` breakpoint) -- per the user,
            this cutoff moved from the original `lg` (1024px) down to
            `md` (768px) and then back up into the low 900s across a
            couple of passes -- via plain flex (DS `Stack` semantics --
            List scrolls independently of the fixed-height Map pane, per
            docs/PLAN.md §2.2's "Side-by-side map+list" item), stacked
            below it. */}
        {view === 'dual' && (
          <div className="mx-[var(--density-layout-fixed-large)] mt-[var(--density-spacing-fixed-small)] flex flex-col gap-[var(--density-spacing-fixed-large)] md:mx-0 min-[920px]:flex-row">
            {/* `md:grid-cols-1 lg:grid-cols-1`, overriding ResultsList's
                own defaults (`md:grid-cols-2`/`lg:grid-cols-3`) at those
                same variants so tailwind-merge actually dedupes them --
                per the user, Dual keeps a single column throughout
                (sharing width with Map leaves even less room than the
                previous 2-column pass assumed), not just a narrower
                column count than List view's own. */}
            {/* A dedicated `<style>` block, not two Tailwind flex-*
                utilities layered across breakpoints -- relying on
                Tailwind's own generated-stylesheet ordering to make a
                `lg:` rule beat an arbitrary `min-[920px]:` one once both
                match (1024px+) isn't a documented guarantee, so this
                spells the cascade out explicitly instead: an even 50/50
                split from 920px, widening to Map's own ~2/3 share (per
                the user/Figma -- node 684:9043's "FA List" 414px beside
                "Map" 774px) at 1024px+, where the later, more specific
                media query is unambiguously what wins. */}
            <style>{`
              @media (min-width: 920px) {
                .dual-view-list, .dual-view-map {
                  flex: 1;
                }
              }
              @media (min-width: 1024px) {
                .dual-view-map {
                  flex: 2;
                }
              }
            `}</style>
            {/* `min-[920px]:min-h-0` -- the actual fix for the "list
                escapes its own max-h-[600px] cap" bug (traced to the
                dead-space-below-the-footer report): a flex item's
                `min-height` defaults to `auto`, not `0`, which for a
                grid/scroll container like this `<ul>` resolves to a
                content-based automatic minimum that can exceed
                `max-height` -- and per the CSS box-sizing spec, a
                conflicting `min-height` always wins over `max-height`,
                so the cap was silently being ignored and the list grew
                to its full, uncapped content height instead of scrolling
                inside 600px. Forcing `min-height: 0` here is what
                actually lets `max-h-[600px]`/`overflow-y-auto` below
                take effect. */}
            <ResultsList
              locations={filteredLocations}
              selectedLocationId={selectedLocationId}
              onSelectLocation={handleListSelect}
              registerItemRef={registerItemRef}
              className="dual-view-list min-[920px]:min-h-0 min-[920px]:max-h-[600px] min-[920px]:overflow-y-auto md:grid-cols-1 lg:grid-cols-1"
            />
            {/* `md:rounded-tl-[...]`/`md:rounded-bl-[...]`, layered on
                top of the base component's own uniform `md:rounded-
                [large]` (24px, all four corners) -- per the user,
                matching Figma's own Dual-view Map Component radius
                ("8px 24px 24px 8px": only the two LEFT corners, which
                border List, drop to the 8px `generous` token; the right
                corners, on the outer edge, stay 24px). Dual-view-only:
                the single-pane Map view keeps its base component's
                uniform 24px, unaffected by this override. */}
            <LocatorMap
              ref={mapRef}
              locations={filteredLocations}
              selectedLocationId={selectedLocationId}
              onPinSelect={handlePinSelect}
              className="dual-view-map md:rounded-tl-[var(--semantic-border-radius-generous)] md:rounded-bl-[var(--semantic-border-radius-generous)]"
            />
          </div>
        )}
      </div>
    </>
  );
}
