import { useMemo } from 'react';
import { locations, type Location } from '../../data/locations';

// docs/PLAN.md §2.2 items 4/6/7: search text, Focus Area filter, and
// Accepting New Clients all compose independently (AND across the three
// axes) against the same static `locations` fixture. A location stays in
// the result set as a whole -- an advisor-name match surfaces their whole
// location, not just that one advisor -- matching `useLocationSearch`'s
// same "results are always location rows" precedent for the typeahead.
export function useFilteredLocations(
  query: string,
  selectedFocusAreas: string[],
  acceptingNewClientsOnly: boolean,
): Location[] {
  return useMemo(() => {
    const trimmed = query.trim().toLowerCase();

    return locations.filter((location) => {
      const matchesQuery =
        !trimmed ||
        location.name.toLowerCase().includes(trimmed) ||
        location.address.toLowerCase().includes(trimmed) ||
        location.advisors.some((advisor) =>
          advisor.name.toLowerCase().includes(trimmed),
        );
      if (!matchesQuery) return false;

      // A location stays if at least one advisor matches at least one
      // selected focus area -- not every selected area needs a match, and
      // not every advisor needs to match.
      const matchesFocusAreas =
        selectedFocusAreas.length === 0 ||
        location.advisors.some((advisor) =>
          advisor.focusAreas.some((area) => selectedFocusAreas.includes(area)),
        );
      if (!matchesFocusAreas) return false;

      if (
        acceptingNewClientsOnly &&
        !location.advisors.some(
          (advisor) => advisor.newClientStatus === 'accepting',
        )
      ) {
        return false;
      }

      return true;
    });
  }, [query, selectedFocusAreas, acceptingNewClientsOnly]);
}
