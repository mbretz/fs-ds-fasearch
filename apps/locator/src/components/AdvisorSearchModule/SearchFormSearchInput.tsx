import { useId, useState } from 'react';
import { SearchInput, highlightMatch } from 'ds';
import { Avatar, MapPinLarge } from 'icons';
import { cn } from '../../utils/cn';
import { useLocationSearch } from './useLocationSearch';

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
  /**
   * Query text is owned by the caller, not this component — both Start and
   * InProgress render this component, and InProgress specifically mounts it
   * twice at once (mobile + desktop, toggled with CSS `hidden` rather than
   * conditionally rendered, same as `FocusAreaFilter`'s own lifted
   * `selectedFocusAreas`). Local state here would let the two instances'
   * query text silently diverge across a container-query resize.
   *
   * The suggestions drawer's own open/closed state deliberately does NOT
   * follow the same lifting pattern — it's local (`useState` below), one
   * copy per instance. Lifting it caused a real bug: both instances'
   * `SearchInput.Suggestions` portal to `document.body`, escaping the
   * `hidden`-container CSS that's the only thing making the mobile-vs-
   * desktop split work, so a shared `open=true` opened both drawers at
   * once — the hidden instance's phantom drawer rendered wherever its own
   * (collapsed, invisible) anchor happened to sit. Keeping `open` local is
   * safe here even though `value` isn't: `hidden`'s `display:none` also
   * takes the container out of the tab order, so only the instance a real
   * user can actually see and focus can ever flip its own `open` to true.
   */
  value: string;
  onValueChange: (value: string) => void;
  /** Fired on Search-button click, Enter, or picking a suggestion. */
  onSubmit: (value: string) => void;
}

// Shared between Start (roomy) and InProgress (condensed) so both stages'
// field/button/suggestions markup stays in one place.
export function SearchFormSearchInput({
  density = 'roomy',
  labelPlacement = 'above',
  className,
  value,
  onValueChange,
  onSubmit,
}: SearchFormSearchInputProps) {
  const fieldId = useId();
  const results = useLocationSearch(value);
  const [open, setOpen] = useState(false);

  function selectResult(label: string) {
    onValueChange(label);
    setOpen(false);
    onSubmit(label);
  }

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
      open={open && results.length > 0}
      onOpenChange={setOpen}
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
        <SearchInput.Field
          id={fieldId}
          density={density}
          placeholder={`Try typing "louis"`}
          value={value}
          onChange={(event) => {
            onValueChange(event.target.value);
            setOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              onSubmit(value);
            }
          }}
          iconEnd={
            value ? (
              <SearchInput.ClearButton
                onClick={() => {
                  onValueChange('');
                  setOpen(false);
                }}
              />
            ) : null
          }
        />
        <SearchInput.Button onClick={() => onSubmit(value)}>
          Search
        </SearchInput.Button>
      </SearchInput.InputGroup>
      {labelPlacement === 'below' && (
        <SearchInput.Microcopy aria-hidden>{LABEL_TEXT}</SearchInput.Microcopy>
      )}
      {/* Suggestions stays 'roomy' regardless of the field's own density —
          same precedent as FocusAreaFilter's Content/Drawer (docs/PLAN.md's
          Search Form Module note): the popover's own density is independent
          of the trigger row's, and InProgress's condensed field would make
          a dense option list cramped for no layout gain. */}
      <SearchInput.Suggestions density="roomy">
        {results.map((result) => {
          const Icon = result.type === 'advisor' ? Avatar : MapPinLarge;
          return (
            <SearchInput.Option
              key={`${result.type}-${result.id}`}
              onSelect={() => selectResult(result.label)}
              // Overrides Option's own default `items-center`/dynamic gap:
              // `items-center` centers the icon across the option's whole
              // (possibly two-line) height once text wraps, not against
              // just the first line — `items-start` plus the icon's own
              // fixed top margin below centers it against the first line
              // specifically, regardless of how many lines follow.
              className="items-start gap-[var(--density-spacing-fixed-small)]"
            >
              {/* Plain icon glyphs, not the DS `Avatar` component — explicit
                  user direction (docs/PLAN.md's Search Form Module note): a
                  lightweight visual indicator of match kind, not a headshot.
                  16x16 (density.sizing.fixed.large), not the field icon's
                  own 24px dynamic-xx-large — this is a smaller, secondary
                  glyph inside a list row, not the field's primary icon.
                  `mt-[...]` is (24px line-height - 16px icon) / 2 = 4px,
                  centering the icon against the text's own first line
                  (`leading-[...]` on the text span below makes that 24px
                  line-height explicit rather than relying on the browser's
                  font-dependent "normal" default, which the 4px math needs
                  to be exact). */}
              <Icon
                aria-hidden
                className="mt-[var(--density-spacing-fixed-x-small)] size-[var(--density-sizing-fixed-large)] shrink-0 text-[color:var(--component-search-input-option-text-color-default)]"
              />
              <span className="min-w-0 flex-1 leading-[length:var(--semantic-content-common-line-height)]">
                {highlightMatch(result.label, value)}
              </span>
            </SearchInput.Option>
          );
        })}
      </SearchInput.Suggestions>
    </SearchInput.Root>
  );
}
