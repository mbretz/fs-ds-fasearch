import type { Location } from '../../data/locations';

interface ResultsListProps {
  locations: Location[];
}

// Deliberately plain text, not a DS `Card`-composed `LocationCard` -- this
// exists to prove the query/focus-area/accepting-new-clients filtering
// logic (`useFilteredLocations`) is wired correctly before investing in the
// polished list UI (docs/PLAN.md §2.2 items 1-3/5, the map, and the real
// `LocationCard`), which is separate, larger, not-yet-scoped work. Lives
// outside `AdvisorSearchModule` (a sibling in `Results.tsx`, per the
// planned selected-focus-area chip row landing in the same place) rather
// than inside `InProgress.tsx`.
export function ResultsList({ locations }: ResultsListProps) {
  if (locations.length === 0) {
    return <p>No locations match the current filters.</p>;
  }

  return (
    <ul>
      {locations.map((location) => (
        <li key={location.id}>
          <p>
            <strong>{location.name}</strong> — {location.address}
          </p>
          <ul>
            {location.advisors.map((advisor) => (
              <li key={advisor.id}>
                {advisor.name}, {advisor.title} ({advisor.newClientStatus})
                {advisor.focusAreas.length > 0 &&
                  ` — ${advisor.focusAreas.join(', ')}`}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
