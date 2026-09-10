import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AdvisorSearchModule } from '../components/AdvisorSearchModule/AdvisorSearchModule';
import { InProgress } from '../components/AdvisorSearchModule/InProgress';
import { ResultsList } from '../components/ResultsList/ResultsList';
import { useFilteredLocations } from '../components/ResultsList/useFilteredLocations';

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

  const filteredLocations = useFilteredLocations(
    query,
    selectedFocusAreas,
    acceptingNewClients,
  );

  function submitSearch(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    setSearchParams({ q: trimmed });
  }

  return (
    <>
      <AdvisorSearchModule>
        <InProgress
          query={query}
          onQueryChange={setQuery}
          onSubmitSearch={submitSearch}
          selectedFocusAreas={selectedFocusAreas}
          onSelectedFocusAreasChange={setSelectedFocusAreas}
          acceptingNewClients={acceptingNewClients}
          onAcceptingNewClientsChange={setAcceptingNewClients}
        />
      </AdvisorSearchModule>
      <ResultsList locations={filteredLocations} />
    </>
  );
}
