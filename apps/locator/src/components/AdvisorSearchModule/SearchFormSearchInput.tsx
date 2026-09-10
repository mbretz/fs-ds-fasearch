import { useId } from 'react';
import { SearchInput } from 'ds';
import { cn } from '../../utils/cn';

const LABEL_TEXT = 'Enter City, State, ZIP, or Advisor Name';

interface SearchFormSearchInputProps {
  density?: 'roomy' | 'condensed';
  /**
   * Desktop shows the label above the field (`SearchInput.Label`); mobile
   * InProgress moves the same text below as microcopy instead — see
   * docs/PLAN.md's Search Form Module responsive note. Stage=Start always
   * uses 'above' on both breakpoints, so this only matters once
   * InProgress.tsx is built.
   */
  labelPlacement?: 'above' | 'below';
  className?: string;
}

// Shared between Start (roomy) and InProgress (condensed) so both stages'
// field/button markup — and later, typeahead wiring — stay in one place.
// Static for now (no suggestions drawer wired up yet); step 5 of the
// approved plan adds `useLocationSearch` + `SearchInput.Suggestions` here.
export function SearchFormSearchInput({
  density = 'roomy',
  labelPlacement = 'above',
  className,
}: SearchFormSearchInputProps) {
  const fieldId = useId();

  // The field's accessible name always comes from a real <label
  // htmlFor={fieldId}> — Microcopy is decorative text only (SearchInput.tsx
  // wires no aria-describedby from it), so 'below' placement can't just
  // swap Label out for Microcopy without leaving the field unnamed. Instead
  // the Label stays mounted but visually hidden (`sr-only`), and the
  // visible Microcopy below is `aria-hidden` so screen readers don't
  // announce the same string twice.
  // This module is always rendered inside the dark AdvisorSearchModule card
  // (see AdvisorSearchModule.tsx), so Label/Microcopy's default text color
  // (`--component-label-text-color-default`/`-microcopy`, tuned for a light
  // surface) reads as low-contrast gray-on-dark. Neither sub-component
  // exposes a color prop, so the fix is overriding the CSS custom property
  // itself on an ancestor — it's a normal inheriting custom property, so
  // setting it here cascades to both spans without touching Label.tsx/
  // Microcopy.tsx. `--semantic-content-common-text-color-reverse` is the
  // DS's actual "light text on dark surface" token.
  return (
    <SearchInput.Root
      density={density}
      className={cn(
        '[--component-label-text-color-default:var(--semantic-content-common-text-color-reverse)] [--component-label-text-color-microcopy:var(--semantic-content-common-text-color-reverse)]',
        className,
      )}
    >
      <SearchInput.Label
        htmlFor={fieldId}
        className={labelPlacement === 'below' ? 'sr-only' : undefined}
      >
        {LABEL_TEXT}
      </SearchInput.Label>
      <SearchInput.InputGroup>
        {/*
          `Field`'s own default `iconEnd` is an unconditional, disabled-
          unaware `SearchInput.ClearButton` — fine for a consumer that
          never manages field state, but this component has no real value
          state yet (typeahead wiring is step 5), so that default renders
          an inert X with nothing to clear. Suppressing it here until step
          5 adds real controlled state + `iconEnd={value && <ClearButton
          onClick={...} />}}`, matching how every other DS story that
          tracks a value does it (see SearchInput.stories.tsx).
        */}
        <SearchInput.Field
          id={fieldId}
          density={density}
          placeholder={`Try typing "louis"`}
          iconEnd={null}
        />
        <SearchInput.Button>Search</SearchInput.Button>
      </SearchInput.InputGroup>
      {labelPlacement === 'below' && (
        <SearchInput.Microcopy aria-hidden>{LABEL_TEXT}</SearchInput.Microcopy>
      )}
    </SearchInput.Root>
  );
}
