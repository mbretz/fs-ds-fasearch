import { useEffect, useRef, useState } from 'react';
import { Button, Checkbox, ChecklistGroup, FilterMenu } from 'ds';
import { CaretDown } from 'icons';
import { cn } from '../../utils/cn';
import { focusAreas } from '../../data/focusAreas';
import { SearchFormSearchInput } from './SearchFormSearchInput';

interface FocusAreaFilterProps {
  selected: string[];
  onSelectedChange: (next: string[]) => void;
  // Figma's FilterMenuHeader/Content are always a white box regardless of
  // the surrounding card (no dark-mode token override exists for
  // `component-filter-menu-*` -- verified against packages/tokens/build/css/
  // dark.css), so only this composition's own "Focus Areas:" label + caret
  // need a light/dark switch to match whichever panel they're sitting on.
  theme: 'light' | 'dark';
  className?: string;
}

// FilterMenu "Select-plus" composition (Figma node 1592:24653): a plain
// "Focus Areas:" label above one real Trigger spanning the whole box --
// Figma models the icon/text/caret as three separate pieces, but making
// only the small icon a trigger (with the live "Selected (N)" text and
// caret both decorative) left most of the box unclickable, and a second
// trigger on the caret would just duplicate the same action across two
// tab stops. `iconEnd`/`children` fold the text+caret into the one real
// Trigger button instead. The Show/Hide label swap built into
// FilterMenu.Trigger isn't used here since "Selected (N)" is driven by
// selection count, a different axis than open/closed state.
//
// `open` is local state, NOT lifted alongside `selected` -- same pattern
// as SearchFormSearchInput's own Suggestions `open` (see its comment).
// InProgress mounts two FocusAreaFilter instances simultaneously (mobile +
// desktop, toggled via CSS `hidden`), and lifting `open` caused a real bug
// here too, despite FilterMenu.Content having no Portal (the earlier
// assumption that no-Portal made this safe was wrong): clicking the
// visible instance's Trigger set the shared `open` to `true`, which also
// flipped the *hidden* instance's own FilterMenu.Root open -- and that
// hidden instance's Radix Popover then ran its own outside-click check,
// saw the triggering click landed inside the *other* (visible) instance's
// DOM subtree rather than its own, decided that was an outside click, and
// called the shared `onOpenChange(false)` right back -- observed directly
// via a temporary console.log wrapper: `setFilterMenuOpen` fired with
// `true` then `false` on the same click, so the menu never visibly opened.
// Keeping `open` local sidesteps this the same way it does for
// SearchFormSearchInput: only the instance a user can actually see/click
// is ever the one whose own Popover state changes.
function FocusAreaFilter({
  selected,
  onSelectedChange,
  theme,
  className,
}: FocusAreaFilterProps) {
  const [open, setOpen] = useState(false);

  function toggle(area: string, checked: boolean) {
    onSelectedChange(
      checked ? [...selected, area] : selected.filter((a) => a !== area),
    );
  }

  return (
    <div
      className={cn(
        // 2px, matching SearchInput's own label-to-field gap.
        'flex flex-col gap-[var(--density-spacing-fixed-xx-small)]',
        theme === 'dark' &&
          '[--component-label-text-color-default:var(--semantic-content-common-text-color-reverse)]',
        className,
      )}
    >
      <span className="text-[length:var(--component-label-font-size-default)] font-[number:var(--component-label-font-weight-default)] text-[color:var(--component-label-text-color-default)]">
        Focus Areas:
      </span>
      <FilterMenu.Root
        open={open}
        onOpenChange={setOpen}
        density="condensed"
        className="w-full"
      >
        <FilterMenu.Header className="w-full">
          {/* `grid grid-cols-[auto_1fr_auto]` overrides Button's own
              `inline-flex justify-center` (which packs icon+label+iconEnd
              together in the middle) -- FilterMenu.Trigger doesn't expose
              iconEnd's or the label's own wrapper className individually,
              so there's no way to give just the label `flex-1` directly.
              Grid sidesteps that: it places children into columns purely
              by DOM order, and a plain `<span>` grid item stretches to
              fill its column by default with no className needed on it,
              so the icon/caret's `auto` columns hug their own content
              while the label's `1fr` column consumes the rest. */}
          {/* `h-[...]` pins the box to exactly SearchInput.Field's height;
              `py-[...]` shrinks Trigger's own default vertical padding so
              its content (24px line-height + border) fits inside that
              fixed height with room to spare, rather than overflowing it --
              an overflowing forced height is what broke `items-center`'s
              symmetry earlier (verified by measuring rendered child
              centers, not assumed). */}
          <FilterMenu.Trigger
            iconEnd={<CaretDown aria-hidden />}
            className="grid h-[var(--density-control-input-small-min-height)] w-full grid-cols-[auto_1fr_auto] bg-[var(--semantic-surface-base-default)] py-[var(--density-spacing-fixed-xx-small)] shadow-[0_0_0_var(--semantic-control-border-width-default)_var(--semantic-control-color-border-color)]"
          >
            {/* `block w-full`: the ButtonLabel span this renders inside
                (Button's own, not reachable via className) stretches to
                fill the grid's `1fr` column, but a plain inline `<span>`
                nested inside it still only hugs its own text width and
                gets centered by the ancestor's alignment -- `block w-full`
                makes this span itself the thing that fills the column, so
                `text-left`/`truncate` (which needs a real width to
                truncate against) apply to something that's actually full
                width. */}
            <span className="block w-full truncate text-left text-[length:var(--semantic-content-common-font-size)] leading-[length:var(--semantic-content-common-line-height)] font-[number:var(--semantic-content-common-font-weight)] text-[color:var(--semantic-content-common-text-color-default)]">
              {selected.length > 0
                ? `Selected (${selected.length})`
                : 'Select Focus Areas'}
            </span>
          </FilterMenu.Trigger>
        </FilterMenu.Header>
        {/* Content/Drawer stay 'roomy' regardless of the Header's own
            condensed density -- same precedent as SearchFormSearchInput's
            Suggestions drawer (docs/PLAN.md's Search Form Module note):
            the popover's own density is independent of the trigger row's,
            and a dense checklist would hurt readability for no layout gain. */}
        <FilterMenu.Content density="roomy">
          <FilterMenu.Drawer>
            <ChecklistGroup.Root>
              <ChecklistGroup.Group>
                {focusAreas.map((area) => (
                  <ChecklistGroup.Item
                    key={area}
                    checked={selected.includes(area)}
                    onCheckedChange={(checked) =>
                      toggle(area, checked === true)
                    }
                  >
                    {area}
                  </ChecklistGroup.Item>
                ))}
              </ChecklistGroup.Group>
            </ChecklistGroup.Root>
          </FilterMenu.Drawer>
          <FilterMenu.Footer>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Apply Filters
            </Button>
            <Button variant="tertiary" onClick={() => onSelectedChange([])}>
              Clear all
            </Button>
          </FilterMenu.Footer>
        </FilterMenu.Content>
      </FilterMenu.Root>
    </div>
  );
}

interface InProgressProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSubmitSearch: (value: string) => void;
  selectedFocusAreas: string[];
  onSelectedFocusAreasChange: (next: string[]) => void;
  acceptingNewClients: boolean;
  onAcceptingNewClientsChange: (value: boolean) => void;
}

// query/selectedFocusAreas/acceptingNewClients are all owned by Results.tsx
// (the page), not this component -- lifted there so the results list and a
// future selected-focus-area chip row (both siblings of AdvisorSearchModule,
// not descendants of it) can read/drive the same filter state. Considered
// a shared React Context for this instead of plain props; rejected because
// Results.tsx renders InProgress/the results list/chip row as direct
// children (one hop each, no indifferent intermediate layers to drill
// through) -- Context earns its cost when state has to cross several
// uninvolved layers, not for three siblings off one page component. Same
// reasoning `Start.tsx` -> `InProgress` already applies to `query` itself:
// prefer explicit lifted state (or, for surviving a route change, the URL)
// over Context here.
export function InProgress({
  query,
  onQueryChange,
  onSubmitSearch,
  selectedFocusAreas,
  onSelectedFocusAreasChange,
  acceptingNewClients,
  onAcceptingNewClientsChange,
}: InProgressProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Same pattern as Start.tsx's own heading focus — moves focus here on
  // mount so a keyboard/AT user lands somewhere meaningful after arriving
  // from Start (transition or not; View Transitions morphs the DOM but
  // doesn't manage focus itself).
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col gap-[var(--density-spacing-fixed-large)] p-[var(--density-spacing-fixed-large)] @[768px]/module:px-[var(--density-spacing-fixed-xx-large)] @[768px]/module:pt-[var(--density-spacing-fixed-large)] @[768px]/module:pb-[var(--density-spacing-fixed-xx-large)]">
      {/*
        `[view-transition-name:advisor-search-heading]` pairs with the
        same name on Start.tsx's H1 wrapper (see AdvisorSearchModule.tsx's
        own comment on the outer shell's matching name) -- this wrapper is
        a single instance on this Stage, unlike SearchFormSearchInput
        below, so no dual-mount duplicate-name risk here.
      */}
      <div className="[view-transition-name:advisor-search-heading] flex flex-col items-start gap-[var(--density-spacing-fixed-x-small)]">
        {/* Heavy (16/24/600) in both InProgress breakpoints -- unlike
            Start's H1, this stage never shows the large Page Title size,
            so no container-query size switch is needed here. */}
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-[length:var(--semantic-content-heavy-font-size)] leading-[length:var(--semantic-content-heavy-line-height)] font-[number:var(--semantic-content-heavy-font-weight)] text-[color:var(--semantic-content-common-text-color-reverse)] outline-none"
        >
          Find a Financial Advisor
        </h1>
        <div className="h-0.5 w-[60px] bg-[var(--semantic-brand-secondary-light-gold)]" />
      </div>

      {/* Mobile only (<768px container width, matching Start.tsx's own
          mobile/tablet split): the dark SearchInput row, then a separate
          light-background panel for the Focus Areas filter + the Checkbox
          -- a user-confirmed structural split, not literally present as
          its own fill in the Figma canvas (see docs/PLAN.md's Search Form
          Module note). `data-theme="light"` re-resolves any theme-scoped
          tokens back to their light values for this subtree. Tablet and up
          carry over the desktop row layout below (its children just
          shrink), rather than getting this stacked treatment. */}
      <div className="flex flex-col gap-[var(--density-spacing-fixed-large)] @[768px]/module:hidden">
        <SearchFormSearchInput
          density="roomy"
          labelPlacement="below"
          value={query}
          onValueChange={onQueryChange}
          onSubmit={onSubmitSearch}
        />
        {/* Negative margins cancel this component's own root padding
            (`p-[--density-spacing-fixed-large]` above) on exactly the sides
            this panel needs full-bleed -- left/right/bottom, not top, since
            it should still sit below the dark bar's own bottom edge rather
            than touching it. No explicit width: the parent's default
            `align-items: stretch` already sizes this child to fill the
            available cross-axis space *minus its margins*, so the negative
            margins alone extend it edge-to-edge -- an explicit `w-full`
            here would fix the width at 100% of the (still-inset) parent
            instead of letting it expand. */}
        <div
          data-theme="light"
          className="-mx-[var(--density-spacing-fixed-large)] -mb-[var(--density-spacing-fixed-large)] flex flex-col items-stretch gap-[var(--density-spacing-fixed-large)] bg-[var(--semantic-surface-base-default)] p-[var(--density-spacing-fixed-large)]"
        >
          <FocusAreaFilter
            theme="light"
            selected={selectedFocusAreas}
            onSelectedChange={onSelectedFocusAreasChange}
          />
          <Checkbox
            checked={acceptingNewClients}
            onCheckedChange={(checked) =>
              onAcceptingNewClientsChange(checked === true)
            }
            className="self-start justify-start"
          >
            Accepting New Clients
          </Checkbox>
        </div>
      </div>

      {/* `items-end`, not `items-center`: SearchInput's label can wrap to a
          second line at tablet widths, and bottom-aligning keeps its and
          FocusAreaFilter's 32px controls flush regardless -- Checkbox's own
          row height already equals that same 32px, so it lines up too with
          no per-item override needed. */}
      <div className="hidden items-end gap-[var(--density-spacing-fixed-xx-large)] @[768px]/module:flex">
        {/*
          `inputGroupClassName` (not `className`) pairs Start's and this
          instance's Field+Button pill specifically, per the same name on
          Start.tsx's own SearchFormSearchInput -- deliberately excludes the
          Label text above it from the morphed group. Also deliberately only
          on this desktop-row instance, not the mobile one above: this
          component dual-mounts (mobile + desktop, toggled via CSS `hidden`
          rather than conditional rendering), and the View Transitions spec
          skips the transition entirely for a name that matches more than
          one element at once -- same class of dual-mount gotcha already
          hit with this pair's `open` state (see SearchFormSearchInput.tsx's
          own comment). Picking one instance means the search-input morph
          only actually plays when landing on desktop; arriving on mobile
          still navigates fine, just without that one piece animating (the
          H1/card-shell names above aren't dual-mounted, so those still
          transition on every breakpoint).
        */}
        <SearchFormSearchInput
          density="condensed"
          labelPlacement="above"
          className="w-[320px] min-w-[200px]"
          inputGroupClassName="[view-transition-name:advisor-search-input]"
          value={query}
          onValueChange={onQueryChange}
          onSubmit={onSubmitSearch}
        />
        <FocusAreaFilter
          theme="dark"
          selected={selectedFocusAreas}
          onSelectedChange={onSelectedFocusAreasChange}
          className="w-[347px] min-w-[220px]"
        />
        {/* Checkbox's label color override mirrors SearchFormSearchInput's
            (Checkbox exposes no color prop either). `-mb-[...]`: Checkbox's
            own row is 40px tall (32px min-height + 8px top/bottom padding
            exceeds the min) vs. the other two controls' fixed 32px, so
            bottom-aligning it flush leaves its glyph sitting 4px above
            their center. Under `items-end`, a *negative* bottom margin is
            what nudges the item's content down (positive margin pushes it
            up instead, since the margin itself occupies the space closest
            to the aligned edge) -- confirmed by measuring rendered
            bounding-box centers, not assumed. `shrink-0`: without it, this
            item is the one that gives when the row runs out of width at
            tablet sizes, wrapping "Accepting New Clients" to two lines --
            that grows Checkbox's own height further and throws off the
            fixed `-mb` offset above, which only holds for its single-line
            height. */}
        <div className="-mb-[var(--density-spacing-fixed-x-small)] shrink-0 [--component-checkbox-text-color-default:var(--semantic-content-common-text-color-reverse)]">
          <Checkbox
            checked={acceptingNewClients}
            onCheckedChange={(checked) =>
              onAcceptingNewClientsChange(checked === true)
            }
          >
            Accepting New Clients
          </Checkbox>
        </div>
      </div>
    </div>
  );
}
