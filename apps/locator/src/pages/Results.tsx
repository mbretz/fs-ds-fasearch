import { useCallback, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import { AdvisorSearchModule } from '../components/AdvisorSearchModule/AdvisorSearchModule';
import { InProgress } from '../components/AdvisorSearchModule/InProgress';
import { FilterFacets } from '../components/FilterFacets/FilterFacets';
import { ResultsList } from '../components/ResultsList/ResultsList';
import {
  useFilteredLocations,
  locationKeepsCardForAdvisor,
  queryMatchesAdvisor,
} from '../components/ResultsList/useFilteredLocations';
import {
  ResultsToolbar,
  type ResultsView,
} from '../components/ResultsToolbar/ResultsToolbar';
import { ProspectPortalLite } from '../components/ProspectPortalLite/ProspectPortalLite';
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
  // the matching pin's "inverse" color treatment (Map/Dual view) -- plain
  // lifted state, not a Context, same reasoning as `query`/
  // `selectedFocusAreas` above. Deliberately NOT what opens a pin's
  // popover on its own anymore -- `Map.tsx` owns that separately now
  // (its own internal `popoverLocationId`, only ever set by a real pin
  // click), per the user, 2026-09-25: Dual view's own list row click
  // should highlight its pin, not duplicate the same info by also
  // popping it open. See `Map.types.ts`'s own `selectedLocationId`/
  // `onPinSelect` doc comments for the full split.
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
  // Only set when the field's own value was populated by picking one
  // specific advisor out of the typeahead dropdown -- see
  // SearchFormSearchInput.tsx's `selectResult` and `submitSearch` below.
  const submittedAdvisorId = searchParams.get('advisorId');
  // Set only by InProgress.tsx's own "Find advisors near me" link (see
  // `findNearMe` below) -- same "URL, not lifted state, carries the
  // submitted mode across a route change" reasoning as `submittedQuery`/
  // `submittedAdvisorId` above.
  const nearMe = searchParams.get('near') === '1';
  const filteredLocations = useFilteredLocations(
    submittedQuery,
    selectedFocusAreas,
    acceptingNewClients,
    submittedAdvisorId,
    nearMe,
  );
  // Every card ResultsList actually renders: one LocationCard per matching
  // branch plus one AdvisorCard per advisor at each of those branches, per
  // the user -- not just a location or advisor count alone. Mirrors
  // ResultsList's own single-advisor-location skip (same split as the
  // map's `getPinType`): a location with exactly one advisor never gets
  // its own LocationCard row there, so it must only count once here too,
  // not once for the location and again for its sole advisor.
  // `locationKeepsCardForAdvisor` (not a bare `.length !== 1` check) is
  // what also counts a search-narrowed-to-one-advisor LocationCard when
  // that advisor's real location had 2+ advisors to begin with -- see
  // that function's own comment.
  // Whether the current results grid should lead with AdvisorCards ahead
  // of any LocationCard(s), per the user (2026-09-26) -- true for a
  // typeahead advisor pick or freeform text that matches an advisor
  // entity, false (the original LocationCard-first order) for a location
  // pick or freeform text that only matches a location's own name/address.
  const advisorCardsFirst = queryMatchesAdvisor(
    submittedQuery,
    filteredLocations,
    submittedAdvisorId,
  );
  const resultsCount = filteredLocations.reduce(
    (sum, location) =>
      sum +
      location.advisors.length +
      (locationKeepsCardForAdvisor(location) ? 1 : 0),
    0,
  );

  function submitSearch(value: string, advisorId?: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    setSearchParams(advisorId ? { q: trimmed, advisorId } : { q: trimmed });
  }

  // InProgress.tsx's own "Find advisors near me" link -- replaces the
  // search params wholesale (`setSearchParams`, not a merge), same as
  // `submitSearch` above, so any previously-submitted `q`/`advisorId` is
  // dropped rather than left stale alongside `near`. Also resets the
  // field's own live-typed `query` text back to empty, since it no
  // longer reflects what the grid is actually showing.
  function findNearMe() {
    setSearchParams({ near: '1' });
    setQuery('');
  }

  const registerItemRef = useCallback((id: string, el: HTMLElement | null) => {
    itemRefsRef.current[id] = el;
  }, []);

  // List row click (Dual view) -> select (colors the pin, per
  // MapPin.tsx's own "inverse" treatment) + fly the map to it, per
  // docs/PLAN.md §2.2's list->map sync. Deliberately does NOT open the
  // pin's popover -- per the user, 2026-09-25, that would duplicate the
  // same info the already-visible list row already shows; only calls
  // `flyTo`, not `Map`'s own pin-click path, see `Map.types.ts`'s own
  // `selectedLocationId` doc comment for the full reasoning.
  function handleListSelect(location: Location) {
    setSelectedLocationId(location.id);
    mapRef.current?.flyTo(location);
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
      {/* Flush-left above the search module, same convention/placement
          as Landing.tsx's own instance -- see its comment for the full
          reasoning. "Search" (not the full `ProspectPortal` card's own
          hardcoded "Search Results" `favoritesFromLabel`, further down
          this page) since this one's Favorites link is reached before
          any results exist yet on a fresh page load, per the user,
          2026-09-26 -- kept distinct rather than importing that
          constant, since the two really are two separate entry points
          (see this page's own `ProspectPortal` below) that happen to
          coexist on the same page rather than one being a redundant
          copy of the other.

          `mt-[4px]` (mobile only, reset at `md`+) -- see Landing.tsx's
          own identical instance/comment for the full reasoning. */}
      <ProspectPortalLite
        favoritesFromLabel="Search"
        className="mt-[4px] mb-[4px] md:mt-0"
      />
      <AdvisorSearchModule>
        <InProgress
          query={query}
          onQueryChange={setQuery}
          onSubmitSearch={submitSearch}
          selectedFocusAreas={selectedFocusAreas}
          onSelectedFocusAreasChange={setSelectedFocusAreas}
          acceptingNewClients={acceptingNewClients}
          onAcceptingNewClientsChange={setAcceptingNewClients}
          onFindNearMe={findNearMe}
        />
      </AdvisorSearchModule>
      {/* The full `ProspectPortal` card (sign-in + "View favorites."
          launcher) that used to sit here was removed, per the user,
          2026-09-26 -- `ProspectPortalLite` above AdvisorSearchModule
          now covers that same job on this page. `FilterFacets`' own
          `mt-[var(--density-layout-fixed-large)]` below already gives it
          the same 16px-below-AdvisorSearchModule spacing this card used
          to establish, so nothing else here needed to change to keep
          that rhythm. */}
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
            advisorCardsFirst={advisorCardsFirst}
            selectedFocusAreas={selectedFocusAreas}
            acceptingNewClientsOnly={acceptingNewClients}
            className="mt-[var(--density-spacing-fixed-small)]"
          />
        )}
        {view === 'map' && (
          <LocatorMap
            ref={mapRef}
            locations={filteredLocations}
            selectedLocationId={selectedLocationId}
            onPinSelect={handlePinSelect}
            selectedFocusAreas={selectedFocusAreas}
            acceptingNewClientsOnly={acceptingNewClients}
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
              advisorCardsFirst={advisorCardsFirst}
              selectedFocusAreas={selectedFocusAreas}
              acceptingNewClientsOnly={acceptingNewClients}
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
              selectedFocusAreas={selectedFocusAreas}
              acceptingNewClientsOnly={acceptingNewClients}
              className="dual-view-map md:rounded-tl-[var(--semantic-border-radius-generous)] md:rounded-bl-[var(--semantic-border-radius-generous)]"
            />
          </div>
        )}
      </div>
    </>
  );
}
