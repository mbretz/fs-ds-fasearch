import type { Location } from '../../data/locations';
import { AdvisorCard } from '../cards/AdvisorCard/AdvisorCard';
import { LocationCard } from '../cards/LocationCard/LocationCard';
import { cn } from '../../utils/cn';

interface ResultsListProps {
  locations: Location[];
  /** Highlights the matching LocationCard row and registers it as a
   * `scrollIntoView()` target for map-pin selection sync (Dual view
   * only -- see Results.tsx). All three are optional/no-ops when unset,
   * since plain List view has no map to sync with. */
  selectedLocationId?: string | null;
  onSelectLocation?: (location: Location) => void;
  registerItemRef?: (id: string, el: HTMLElement | null) => void;
  className?: string;
}

// Matches the "Locator/Desktop/List/FocusAreas-Display" reference
// (`693:18125`): a `Branch-Card-SidePanels` (LocationCard) row first, then
// the matching `FA-Card-*` (AdvisorCard) rows below -- not a flat
// AdvisorCard-only list. `useFilteredLocations` already narrows each
// location's `advisors` array down to just the advisors matching the active
// facet filters (2026-09-20), so every filtered location renders its own
// LocationCard, followed by only its matching advisors as their own
// AdvisorCard.
//
// Same single-vs-not split as the map's own `getPinType` (Map/pinType.ts)
// -- a location with exactly one advisor never gets its own LocationCard
// row, per the user: that card's own name is just the location's
// address, which AdvisorCard already shows, so it'd be a fully redundant
// row. Locations with 0 (support-staff-only) or 2+ advisors keep their
// LocationCard, same as the map keeps those on a generic "branch" pin
// rather than featuring one specific advisor. For a single-advisor
// location, that advisor's own `<li>` below takes over the
// LocationCard's row-level responsibilities instead (the `ref`/`onClick`/
// selection-ring props map/list sync needs) -- see `isSingleAdvisor`
// below.
//
// One shared 2-column (`md`+) / 3-column (`lg`+, 1024px -- the closest
// Tailwind breakpoint to 920px) grid, not a LocationCard section followed
// by a separately-gridded advisor `<ul>`, per the user -- `col-span-full`
// only means something relative to a shared set of column tracks, so
// LocationCard has to be part of the same grid the advisor cards use to
// span all of its columns. A side effect: the gap between the location
// row(s) and the advisor cards below is now the same `fixed-large` gap
// used between advisor cards, not the larger `fixed-xxx-large` gap the
// previous two-container layout had.
//
// Horizontal margin: 16px (`layout.fixed.large`) below `md`, none at `md`+
// -- `<main>` (SiteShell.tsx) has zero padding of its own below `md`, so
// mobile needs an explicit inset here, matching ResultsToolbar/
// FilterFacets/ProspectPortal's own 16px rather than the previous 8px,
// per the user; at `md`+ this matches
// AdvisorSearchModule's own behavior (see SiteShell.tsx's `<main>`
// comment), which adds no margin of its own there either, relying
// entirely on `<main>`'s ambient padding -- so a bare `md:mx-0` override
// lines this up with it for free rather than needing a second value.
//
// `max-w-[729px] mx-auto` on each AdvisorCard `<li>` ONLY (not
// LocationCard's own, which spans every column via `col-span-full` and
// is deliberately the grid's widest, row-mode item by design -- see its
// own comment) -- confirmed live (Playwright), 2026-09-22: below `md`
// this grid is a single, full-width column, and at real tablet-portrait-
// ish widths (roughly 600-767px) that one column is comfortably wide
// enough to push an AdvisorCard past `EntityCard`'s own 730px
// `dropFirstPanelBelow` ceiling into full 3-column row mode -- something
// the 2/3-column tiers below `md` were deliberately kept clear of (see
// their own comment), but this single-column band wasn't. Crossing `md`
// (768px) then made each AdvisorCard's own width crash straight back
// down to ~352px (a 2-column split of this grid's ~720px content width)
// -- a jarring "blip" where the card's whole shape (a 3-column row) flips
// to fully stacked in one pixel step, purely because a window got
// slightly WIDER. 729px, not AdvisorCard's own base 680px row-mode
// threshold -- capping at 680 would ALSO flatten the 680-729px
// `dropFirstPanelBelow` tier (Office Details beside main, Focus Areas
// full-width below) out of this single-column band entirely, hiding
// Office Details in a range where it's meant to stay visible (confirmed
// the hard way -- an initial 679px cap shipped broken this way). 729px
// keeps that tier reachable while still removing the full-row overshoot
// above it. `mx-auto` centers the capped card within its own (wider,
// single-column) grid cell rather than leaving it flush left with dead
// space to its right.
export function ResultsList({
  locations,
  selectedLocationId,
  onSelectLocation,
  registerItemRef,
  className,
}: ResultsListProps) {
  if (locations.length === 0) {
    return <p className={className}>No advisors match the current filters.</p>;
  }

  return (
    // `relative` -- root cause of the Dual-view "dead space below the
    // footer" bug, traced via the browser console (per the user,
    // 2026-09-24): every card renders at least one Tailwind `.sr-only`
    // span (e.g. Link's own "(opens in a new window)" label) --
    // `position: absolute` with no explicit inset, so it falls back to
    // its "static position" (where it'd sit in normal flow). Without a
    // `position: relative` ancestor to act as its containing block,
    // that static-position calculation escapes all the way to the
    // document root -- harmless in List view (nothing's clipped there,
    // so it lands exactly where real content already is), but once
    // Dual's `min-[920px]:max-h-[600px] overflow-y-auto` (below) clips
    // and scrolls this list, those spans' *unclipped* static positions
    // (still reflecting the full, un-scrolled layout) kept inflating
    // `documentElement.scrollHeight` by tens of thousands of px while
    // staying completely invisible to `document.body`'s own box model.
    // `relative` here gives every descendant `.sr-only` span a LOCAL
    // containing block instead, so its static position resolves within
    // this scrollable box rather than escaping past it.
    <ul
      className={cn(
        'relative mx-[var(--density-layout-fixed-large)] grid grid-cols-1 gap-[var(--density-spacing-fixed-large)] md:mx-0 md:grid-cols-2 lg:grid-cols-3',
        className,
      )}
    >
      {/* `col-span-full`, per the user -- LocationCard rows span every
          current column (whatever the active breakpoint's count is)
          rather than living in a separate 1-column container, so they
          need to be part of the *same* grid the advisor cards use
          (spanning only means something relative to a shared set of
          column tracks). Skips single-advisor locations entirely -- see
          this file's own top comment. */}
      {locations
        .filter((location) => location.advisors.length !== 1)
        .map((location) => (
          <li
            key={location.id}
            ref={(el) => registerItemRef?.(location.id, el)}
            onClick={() => onSelectLocation?.(location)}
            className={cn(
              'col-span-full',
              selectedLocationId === location.id &&
                // A real `border`, not a `ring` (box-shadow) -- per the
                // user, the ring was only showing up as a faint sliver
                // along the card's top edge rather than a full outline
                // (Dual view's map<->list selection highlight). A border
                // directly on this wrapper participates in the normal
                // box model instead of an outside-the-box shadow, so it
                // can't be partially covered the way the ring apparently
                // was.
                'relative z-10 border-[length:var(--component-tag-border-width)] border-[color:var(--color-intent-primary-base)] rounded-[var(--semantic-border-radius-generous)]',
            )}
          >
            <LocationCard location={location} />
          </li>
        ))}
      {/* 2 columns at `md`+, 3 at `lg`+, each rendering well under
          `EntityCard`'s own 680px side-panel threshold, so every
          `AdvisorCard` naturally drops into its stacked/portrait layout
          (`OfficeDetailsPanel` hidden, `FocusAreasPanel` stacked below
          main) purely from the width change -- no separate prop needed
          to ask for that layout. */}
      {locations.flatMap((location) => {
        // This location has no LocationCard row above (see this file's
        // own top comment) -- its one advisor's `<li>` picks up that
        // row's `ref`/`onClick`/selection-ring props instead, so map<->
        // list sync (Results.tsx) still has something to target by this
        // location's own id.
        const isSingleAdvisor = location.advisors.length === 1;
        return location.advisors.map((advisor) => (
          <li
            key={advisor.id}
            ref={
              isSingleAdvisor
                ? (el) => registerItemRef?.(location.id, el)
                : undefined
            }
            onClick={
              isSingleAdvisor ? () => onSelectLocation?.(location) : undefined
            }
            className={cn(
              'mx-auto w-full max-w-[729px]',
              isSingleAdvisor &&
                selectedLocationId === location.id &&
                // Same border-not-ring fix as the LocationCard `<li>`
                // above -- see its own comment.
                'relative z-10 border-[length:var(--component-tag-border-width)] border-[color:var(--color-intent-primary-base)] rounded-[var(--semantic-border-radius-generous)]',
            )}
          >
            {/* `showPortraitBadge={false}` -- per the user, `StatusTag`
                (above the portrait) already shows this advisor's status
                here, so the portrait's own corner badge would just
                repeat it. */}
            <AdvisorCard
              advisor={advisor}
              location={location}
              showPortraitBadge={false}
            />
          </li>
        ));
      })}
    </ul>
  );
}
