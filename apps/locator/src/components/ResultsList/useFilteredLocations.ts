import { useMemo } from 'react';
import { locations, type Advisor, type Location } from '../../data/locations';
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

function advisorMatchesFacets(
  advisor: Advisor,
  selectedFocusAreas: string[],
  acceptingNewClientsOnly: boolean,
): boolean {
  const matchesFocusAreas =
    selectedFocusAreas.length === 0 ||
    advisor.focusAreas.some((area) => selectedFocusAreas.includes(area));
  if (!matchesFocusAreas) return false;

  if (acceptingNewClientsOnly && advisor.newClientStatus !== 'accepting') {
    return false;
  }

  return true;
}

// A location stays only if at least one of its advisors matches the active
// facet filters, and only that location's *matching* advisors are kept --
// per the user (2026-09-20), checking "Accepting New Clients" or applying a
// focus area should shrink the advisor cards actually shown at a branch,
// not just decide whether the branch appears at all.
function applyFacetFilters(
  location: Location,
  selectedFocusAreas: string[],
  acceptingNewClientsOnly: boolean,
): Location | null {
  const matchingAdvisors = location.advisors.filter((advisor) =>
    advisorMatchesFacets(advisor, selectedFocusAreas, acceptingNewClientsOnly),
  );
  if (matchingAdvisors.length === 0) return null;
  return matchingAdvisors.length === location.advisors.length
    ? location
    : { ...location, advisors: matchingAdvisors };
}

// Picking one specific advisor out of the typeahead dropdown
// (SearchFormSearchInput) narrows a location's own `advisors` array down to
// just that one advisor -- same shape as `applyFacetFilters` above -- so a
// location with several advisors only ever renders the one that was
// actually picked, not every advisor at that branch. Per the user
// (2026-09-25): picking a specific advisor should never surface their
// location-mates.
function applyAdvisorIdFilter(
  selectedAdvisorId: string,
  selectedFocusAreas: string[],
  acceptingNewClientsOnly: boolean,
): Location[] {
  const match = locations.find((location) =>
    location.advisors.some((advisor) => advisor.id === selectedAdvisorId),
  );
  if (!match) return [];

  const targetAdvisor = match.advisors.find(
    (advisor) => advisor.id === selectedAdvisorId,
  );
  if (
    !targetAdvisor ||
    !advisorMatchesFacets(
      targetAdvisor,
      selectedFocusAreas,
      acceptingNewClientsOnly,
    )
  ) {
    return [];
  }

  return [{ ...match, advisors: [targetAdvisor] }];
}

// A location narrowed down to one advisor by `applyAdvisorIdFilter` above
// still needs its own LocationCard row when it *originally* had 2+
// advisors -- per the user (2026-09-25): picking "Louis Everhart" out of a
// multi-advisor branch should show that one AdvisorCard *plus* the
// branch's own LocationCard, not fold into ResultsList's existing
// single-advisor-location case (that case is for a location that only
// ever had one advisor to begin with, where the LocationCard would be
// fully redundant -- see ResultsList.tsx's own comment). Looks the
// location back up in the raw, unfiltered fixture data (not the narrowed
// `location` passed in) to tell "genuinely single-advisor" apart from
// "search-narrowed down to one".
export function locationKeepsCardForAdvisor(
  location: Location,
  selectedAdvisorId: string | null | undefined,
): boolean {
  if (location.advisors.length !== 1) return true;
  if (!selectedAdvisorId || location.advisors[0]?.id !== selectedAdvisorId) {
    return false;
  }
  const original = locations.find((l) => l.id === location.id);
  return (original?.advisors.length ?? 1) !== 1;
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

// Drives ResultsList's card ordering (2026-09-26, per the user): a search
// that resolves to a specific advisor entity -- a typeahead advisor pick
// (`selectedAdvisorId`), or freeform text that happens to match an
// advisor's name -- should surface that AdvisorCard ahead of the
// LocationCard(s), while a location pick or freeform text matching only a
// location's name/address keeps the existing LocationCard-first order.
// Checked against `resultLocations` (the already-resolved result set, not
// the full fixture list) so this reads the exact same narrow-vs-broad tier
// that actually produced those results, rather than re-deriving which
// tier fired.
export function queryMatchesAdvisor(
  searchQuery: string,
  resultLocations: Location[],
  selectedAdvisorId?: string | null,
): boolean {
  if (selectedAdvisorId) return true;

  const trimmedLowerQuery = searchQuery.trim().toLowerCase();
  if (!trimmedLowerQuery) return false;

  return resultLocations.some((location) =>
    location.advisors.some((advisor) => {
      const fullName = getFullName(advisor).toLowerCase();
      return (
        fullName.includes(trimmedLowerQuery) ||
        advisor.firstName.toLowerCase().includes(trimmedLowerQuery) ||
        advisor.lastName.toLowerCase().includes(trimmedLowerQuery)
      );
    }),
  );
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
  // Set only when the field's own value was populated by picking a
  // specific advisor out of the typeahead dropdown (not a location pick,
  // not typed-and-submitted text) -- see SearchFormSearchInput.tsx's
  // `selectResult` and Results.tsx/Start.tsx's `submitSearch`.
  selectedAdvisorId?: string | null,
): Location[] {
  return useMemo(() => {
    if (selectedAdvisorId) {
      return applyAdvisorIdFilter(
        selectedAdvisorId,
        selectedFocusAreas,
        acceptingNewClientsOnly,
      );
    }

    const trimmedLowerQuery = searchQuery.trim().toLowerCase();

    const narrowMatches = locations
      .filter((location) => matchesNarrowQuery(location, trimmedLowerQuery))
      .map((location) =>
        applyFacetFilters(
          location,
          selectedFocusAreas,
          acceptingNewClientsOnly,
        ),
      )
      .filter((location): location is Location => location !== null);
    if (narrowMatches.length > 0 || !trimmedLowerQuery) return narrowMatches;

    // Narrow found nothing for a real (non-empty) submitted query -- per
    // the user's dispatch choice, fall back to the broader city/name match.
    return locations
      .filter((location) => matchesBroadQuery(location, trimmedLowerQuery))
      .map((location) =>
        applyFacetFilters(
          location,
          selectedFocusAreas,
          acceptingNewClientsOnly,
        ),
      )
      .filter((location): location is Location => location !== null);
  }, [
    searchQuery,
    selectedFocusAreas,
    acceptingNewClientsOnly,
    selectedAdvisorId,
  ]);
}
