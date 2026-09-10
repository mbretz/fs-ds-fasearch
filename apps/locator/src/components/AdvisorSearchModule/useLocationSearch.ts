import { useMemo } from 'react';
import { locations, type Advisor, type Location } from '../../data/locations';

export type LocationSearchResult =
  | {
      type: 'advisor';
      id: string;
      label: string;
      advisor: Advisor;
      location: Location;
    }
  | { type: 'location'; id: string; label: string; location: Location };

// Caps the drawer to a readable length rather than dumping every fixture
// match -- 8 keeps the "louis" collision demo (Louis Everhart the advisor
// + St. Louis Downtown the location) comfortably inside the first screen
// of results alongside a couple of neighbors.
const MAX_RESULTS = 8;

// Single combined result list, not two separate advisor/location lists --
// the field's own placeholder ("Enter City, State, ZIP, or Advisor Name")
// already promises both kinds of match in one box, and `SearchInput.Option`
// pairs each result with its own leading icon (Avatar vs MapPinLarge) so
// the two kinds stay visually distinct without needing separate sections.
export function useLocationSearch(query: string): LocationSearchResult[] {
  return useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return [];
    const lower = trimmed.toLowerCase();
    const results: LocationSearchResult[] = [];

    for (const location of locations) {
      if (
        location.name.toLowerCase().includes(lower) ||
        location.address.toLowerCase().includes(lower)
      ) {
        results.push({
          type: 'location',
          id: location.id,
          label: location.name,
          location,
        });
      }

      for (const advisor of location.advisors) {
        if (advisor.name.toLowerCase().includes(lower)) {
          results.push({
            type: 'advisor',
            id: advisor.id,
            label: advisor.name,
            advisor,
            location,
          });
        }
      }
    }

    return results.slice(0, MAX_RESULTS);
  }, [query]);
}
