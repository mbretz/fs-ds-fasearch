import type { Location } from '../../data/locations';
import { AdvisorCard } from '../cards/AdvisorCard/AdvisorCard';
import { LocationCard } from '../cards/LocationCard/LocationCard';
import { cn } from '../../utils/cn';

interface ResultsListProps {
  locations: Location[];
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
// Horizontal margin: 8px (`layout.fixed.small`) below `md`, none at `md`+
// -- `<main>` (SiteShell.tsx) has zero padding of its own below `md`, so
// mobile needs an explicit inset here; at `md`+ this matches
// AdvisorSearchModule's own behavior (see SiteShell.tsx's `<main>`
// comment), which adds no margin of its own there either, relying
// entirely on `<main>`'s ambient padding -- so a bare `md:mx-0` override
// lines this up with it for free rather than needing a second value.
export function ResultsList({ locations, className }: ResultsListProps) {
  if (locations.length === 0) {
    return <p className={className}>No advisors match the current filters.</p>;
  }

  return (
    <ul
      className={cn(
        'mx-[var(--density-layout-fixed-small)] grid grid-cols-1 gap-[var(--density-spacing-fixed-large)] md:mx-0 md:grid-cols-2 lg:grid-cols-3',
        className,
      )}
    >
      {/* `col-span-full`, per the user -- LocationCard rows span every
          current column (whatever the active breakpoint's count is)
          rather than living in a separate 1-column container, so they
          need to be part of the *same* grid the advisor cards use
          (spanning only means something relative to a shared set of
          column tracks). */}
      {locations.map((location) => (
        <li key={location.id} className="col-span-full">
          <LocationCard location={location} />
        </li>
      ))}
      {/* 2 columns at `md`+, 3 at `lg`+, each rendering well under
          `EntityCard`'s own 680px side-panel threshold, so every
          `AdvisorCard` naturally drops into its stacked/portrait layout
          (`OfficeDetailsPanel` hidden, `FocusAreasPanel` stacked below
          main) purely from the width change -- no separate prop needed
          to ask for that layout. */}
      {locations.flatMap((location) =>
        location.advisors.map((advisor) => (
          <li key={advisor.id}>
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
        )),
      )}
    </ul>
  );
}
