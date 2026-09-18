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
// AdvisorCard-only list. Filtering happens at the location level
// (`useFilteredLocations` keeps every advisor at a matching branch, not
// just the one that matched), so every filtered location renders its own
// LocationCard, followed by every one of its advisors as its own
// AdvisorCard.
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
    <div
      className={cn(
        'mx-[var(--density-layout-fixed-small)] flex flex-col gap-[var(--density-spacing-fixed-xxx-large)] md:mx-0',
        className,
      )}
    >
      {locations.map((location) => (
        <LocationCard key={location.id} location={location} />
      ))}
      <ul className="flex flex-col gap-[var(--density-spacing-fixed-large)]">
        {locations.flatMap((location) =>
          location.advisors.map((advisor) => (
            <li key={advisor.id}>
              <AdvisorCard advisor={advisor} location={location} />
            </li>
          )),
        )}
      </ul>
    </div>
  );
}
