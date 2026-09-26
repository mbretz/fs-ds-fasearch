import { useMemo } from 'react';
import { locations, type Advisor, type Location } from '../../data/locations';
import { getFullName } from '../../utils/getFullName';
import { haversineDistanceMiles } from '../../utils/haversineDistanceMiles';

// "Near Me" (InProgress.tsx's own "Find advisors near me" link) --
// reconstructed per docs/PLAN.md's own note (2026-09-20): a FIXED fake
// user location (this fixture's own geographic centroid -- the plain
// average of every location's `lat`/`lng`, not any one real location's
// coordinates), sorted against by real `haversineDistanceMiles` -- zero
// `navigator.geolocation`, zero external geocoding, matching the
// "zero-key/static/StackBlitz-bulletproof" ethos that note also
// documents. Computed once at module load (the fixture itself never
// changes at runtime), not per-render.
const FAKE_USER_LOCATION = {
  lat:
    locations.reduce((sum, location) => sum + location.lat, 0) /
    locations.length,
  lng:
    locations.reduce((sum, location) => sum + location.lng, 0) /
    locations.length,
};

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

// LocationCard's own "Branch Advisors" panel (`AdvisorsAtLocationPanel`)
// and "N Financial Advisors" summary text want the branch's REAL full
// roster, not whichever narrower `advisors` subset actually matched the
// *search* (a typeahead pick, or freeform text narrowed by
// `narrowByNarrowQuery`/`narrowByBroadQuery`/`applyAdvisorIdFilter`
// below) -- per the user, 2026-09-26: a location that surfaced because
// one specific advisor's name matched (e.g. "Castellano" containing
// "no") still represents the whole branch, and showing only that one
// advisor there read as factually wrong ("1 Financial Advisor" for a
// branch that really has 4). Facet filters (Focus Areas/Accepting New
// Clients) are still applied here, deliberately -- that's the existing,
// separately-documented 2026-09-20 behavior (`applyFacetFilters`'s own
// comment): those are meant to shrink what a branch's own card shows,
// unlike a search match. Looks the location back up in the raw,
// unfiltered fixture data (not the narrowed `location` passed in), same
// reason `locationKeepsCardForAdvisor` does.
export function getBranchRosterLocation(
  location: Location,
  selectedFocusAreas: string[],
  acceptingNewClientsOnly: boolean,
): Location {
  const original = locations.find((l) => l.id === location.id);
  if (!original) return location;
  return (
    applyFacetFilters(original, selectedFocusAreas, acceptingNewClientsOnly) ??
    location
  );
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

// A location narrowed down to one advisor -- whether by
// `applyAdvisorIdFilter` above (a typeahead pick) or by
// `narrowByNarrowQuery`/`narrowByBroadQuery` below (freeform text that
// happens to match one specific advisor's name at an otherwise
// multi-advisor branch) -- still needs its own LocationCard row when it
// *originally* had 2+ advisors -- per the user (2025-09-25, generalized
// 2026-09-26 to cover the freeform-text case too): narrowing down to one
// advisor at a multi-advisor branch should show that one AdvisorCard
// *plus* the branch's own LocationCard, not fold into ResultsList's
// existing single-advisor-location case (that case is for a location
// that only ever had one advisor to begin with, where the LocationCard
// would be fully redundant -- see ResultsList.tsx's own comment). No
// longer takes a `selectedAdvisorId` param -- every narrowing path above
// already narrows `location.advisors` down to exactly the right
// advisor(s) before this ever sees it, so there's nothing left for a
// second id check to add; this just needs to tell "genuinely
// single-advisor" apart from "narrowed down to one", which only needs
// the raw, unfiltered fixture data (not the narrowed `location` passed
// in) to compare against.
export function locationKeepsCardForAdvisor(location: Location): boolean {
  if (location.advisors.length !== 1) return true;
  const original = locations.find((l) => l.id === location.id);
  return (original?.advisors.length ?? 1) !== 1;
}

// The existing, narrow literal-substring match against name/address/advisor
// full name -- unchanged matching behavior from before the 2026-09-20
// broad-search addition below, EXCEPT it now also narrows `location.advisors`
// down to just the advisor(s) that actually matched by name, per the user,
// 2026-09-26: submitting "tay" used to keep every advisor at Taylor Nair's
// branch (this function only ever returned a boolean, so a location survived
// whole the moment *any* one of its advisors matched, discarding *which*
// advisor actually matched), not just Taylor Nair. A location match via its
// own name/address is different -- there every advisor at that location is
// still a genuine result (the query was about the *branch*, not a specific
// person), so that path returns the location unnarrowed.
function narrowByNarrowQuery(
  location: Location,
  trimmedLowerQuery: string,
): Location | null {
  if (!trimmedLowerQuery) return location;

  const matchesLocationIdentity =
    location.name.toLowerCase().includes(trimmedLowerQuery) ||
    location.address.toLowerCase().includes(trimmedLowerQuery);
  if (matchesLocationIdentity) return location;

  const matchingAdvisors = location.advisors.filter((advisor) =>
    getFullName(advisor).toLowerCase().includes(trimmedLowerQuery),
  );
  if (matchingAdvisors.length === 0) return null;
  return matchingAdvisors.length === location.advisors.length
    ? location
    : { ...location, advisors: matchingAdvisors };
}

// docs/PLAN.md §2.2's 2026-09-10 "explicit submit" note: city-literal place
// match (against the structured `city`/`zip` fields, not a re-parse of
// `address`) plus a first-or-last-name match checked as two separate parts,
// not one concatenated string -- e.g. "paul" matches an advisor whose
// *lastName* is "Paul", not just a lucky substring hit spanning the space in
// "firstName lastName". Narrows `location.advisors` down to just the
// advisor(s) that actually matched by name part, same fix and same
// city/address-match exception as `narrowByNarrowQuery` above -- this tier
// had the identical bug.
function narrowByBroadQuery(
  location: Location,
  trimmedLowerQuery: string,
): Location | null {
  const normalizedQuery = normalizePlace(trimmedLowerQuery);
  if (!normalizedQuery) return null;

  const matchesCity = normalizePlace(location.city) === normalizedQuery;
  const matchesZip = location.zip === trimmedLowerQuery.replace(/\D/g, '');
  if (matchesCity || matchesZip) return location;

  const matchingAdvisors = location.advisors.filter(
    (advisor) =>
      advisor.firstName.toLowerCase().includes(trimmedLowerQuery) ||
      advisor.lastName.toLowerCase().includes(trimmedLowerQuery),
  );
  if (matchingAdvisors.length === 0) return null;
  return matchingAdvisors.length === location.advisors.length
    ? location
    : { ...location, advisors: matchingAdvisors };
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
  // Set only by InProgress.tsx's own "Find advisors near me" link (see
  // Results.tsx's own `findNearMe`) -- an explicit action same tier as
  // `selectedAdvisorId`/a submitted `searchQuery`, per this function's own
  // top comment. Checked after `selectedAdvisorId` (a typeahead pick is
  // the more specific, deliberate choice) but before any typed query --
  // clicking this link is itself how `searchQuery` gets cleared
  // (Results.tsx's `findNearMe` clears it), so in practice the two never
  // actually compete, but the ordering documents the intended priority
  // regardless.
  nearMe = false,
): Location[] {
  return useMemo(() => {
    if (selectedAdvisorId) {
      return applyAdvisorIdFilter(
        selectedAdvisorId,
        selectedFocusAreas,
        acceptingNewClientsOnly,
      );
    }

    if (nearMe) {
      return locations
        .map((location) =>
          applyFacetFilters(
            location,
            selectedFocusAreas,
            acceptingNewClientsOnly,
          ),
        )
        .filter((location): location is Location => location !== null)
        .sort(
          (a, b) =>
            haversineDistanceMiles(
              FAKE_USER_LOCATION.lat,
              FAKE_USER_LOCATION.lng,
              a.lat,
              a.lng,
            ) -
            haversineDistanceMiles(
              FAKE_USER_LOCATION.lat,
              FAKE_USER_LOCATION.lng,
              b.lat,
              b.lng,
            ),
        );
    }

    const trimmedLowerQuery = searchQuery.trim().toLowerCase();

    const narrowMatches = locations
      .map((location) => narrowByNarrowQuery(location, trimmedLowerQuery))
      .filter((location): location is Location => location !== null)
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
      .map((location) => narrowByBroadQuery(location, trimmedLowerQuery))
      .filter((location): location is Location => location !== null)
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
    nearMe,
  ]);
}
