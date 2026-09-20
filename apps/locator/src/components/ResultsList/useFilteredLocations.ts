import { useMemo } from 'react';
import { locations, type Location } from '../../data/locations';
import { getFullName } from '../../utils/getFullName';

// Strips punctuation locations.city can carry ("St. Louis", "O'Fallon") so a
// punctuation-free typed query ("st louis") still compares equal to it --
// docs/PLAN.md §2.2's 2026-09-10 "explicit submit" note's first example.
function normalizePlace(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function matchesFocusAreasAndAcceptingOnly(
  location: Location,
  selectedFocusAreas: string[],
  acceptingNewClientsOnly: boolean,
): boolean {
  // A location stays if at least one advisor matches at least one selected
  // focus area -- not every selected area needs a match, and not every
  // advisor needs to match.
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
}

// The existing, narrow literal-substring match against name/address/advisor
// full name -- unchanged behavior from before the 2026-09-20 broad-search
// addition below.
function matchesNarrowQuery(location: Location, trimmedLowerQuery: string) {
  return (
    !trimmedLowerQuery ||
    location.name.toLowerCase().includes(trimmedLowerQuery) ||
    location.address.toLowerCase().includes(trimmedLowerQuery) ||
    location.advisors.some((advisor) =>
      getFullName(advisor).toLowerCase().includes(trimmedLowerQuery),
    )
  );
}

// docs/PLAN.md §2.2's 2026-09-10 "explicit submit" note: city-literal place
// match (against the structured `city`/`zip` fields, not a re-parse of
// `address`) plus a first-or-last-name match checked as two separate parts,
// not one concatenated string -- e.g. "paul" matches an advisor whose
// *lastName* is "Paul", not just a lucky substring hit spanning the space in
// "firstName lastName".
function matchesBroadQuery(location: Location, trimmedLowerQuery: string) {
  const normalizedQuery = normalizePlace(trimmedLowerQuery);
  if (!normalizedQuery) return false;

  const matchesCity = normalizePlace(location.city) === normalizedQuery;
  const matchesZip = location.zip === trimmedLowerQuery.replace(/\D/g, '');
  const matchesAdvisorNamePart = location.advisors.some(
    (advisor) =>
      advisor.firstName.toLowerCase().includes(trimmedLowerQuery) ||
      advisor.lastName.toLowerCase().includes(trimmedLowerQuery),
  );

  return matchesCity || matchesZip || matchesAdvisorNamePart;
}

// `searchQuery` is the *submitted* query, not whatever's currently typed in
// the field -- per the user (2026-09-20), the results grid should only
// change on an explicit action (a typeahead option picked, Enter/Search
// pressed, or Near Me toggled), never live on every keystroke. Results.tsx
// passes `searchParams.get('q')`, which by construction only changes inside
// `submitSearch` -- and `SearchFormSearchInput.selectResult` already routes
// a picked suggestion through that same `onSubmit` path, so both triggers
// land here identically. The field's own live value still drives the
// typeahead dropdown (`useLocationSearch`, a separate hook) uninterrupted;
// only this grid-filtering pass waits for a submit.
export function useFilteredLocations(
  searchQuery: string,
  selectedFocusAreas: string[],
  acceptingNewClientsOnly: boolean,
): Location[] {
  return useMemo(() => {
    const trimmedLowerQuery = searchQuery.trim().toLowerCase();

    const narrowMatches = locations.filter(
      (location) =>
        matchesNarrowQuery(location, trimmedLowerQuery) &&
        matchesFocusAreasAndAcceptingOnly(
          location,
          selectedFocusAreas,
          acceptingNewClientsOnly,
        ),
    );
    if (narrowMatches.length > 0 || !trimmedLowerQuery) return narrowMatches;

    // Narrow found nothing for a real (non-empty) submitted query -- per
    // the user's dispatch choice, fall back to the broader city/name match.
    return locations.filter(
      (location) =>
        matchesBroadQuery(location, trimmedLowerQuery) &&
        matchesFocusAreasAndAcceptingOnly(
          location,
          selectedFocusAreas,
          acceptingNewClientsOnly,
        ),
    );
  }, [searchQuery, selectedFocusAreas, acceptingNewClientsOnly]);
}
