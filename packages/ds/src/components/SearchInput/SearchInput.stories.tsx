import { useId, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchInput } from './SearchInput';
import { highlightMatch } from '../../utils/highlight-match';

const meta = {
  title: 'Primitives/SearchInput',
  component: SearchInput.Field,
  argTypes: {
    disabled: { control: 'boolean' },
    density: {
      control: 'radio',
      options: ['roomy', 'condensed'],
      description: 'Explicit override; omit to inherit from data-density.',
    },
    placeholder: { control: 'text' },
    className: { control: false, table: { disable: true } },
    ref: { control: false, table: { disable: true } },
  },
  args: {
    disabled: false,
    placeholder: 'Search',
  },
} satisfies Meta<typeof SearchInput.Field>;

export default meta;
type Story = StoryObj<typeof meta>;

const FRUITS = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig'];

/**
 * The compound API's live type-ahead demo — this is what the "full
 * combobox" scope decision was for. Suggestions filter as you type, the
 * drawer opens once there's at least one match, and picking one (click,
 * Enter, or Space on an Option) writes it back into the field and returns
 * focus there. Arrow keys move real DOM focus between the field and the
 * option list (see `SearchInput.tsx`'s `moveFocus` for why); the drawer
 * itself never shows a "selected" option, since a chosen suggestion closes
 * the drawer immediately rather than staying checked (unlike SelectInput).
 */
function TypeAheadDemo({
  disabled,
  density,
}: {
  disabled?: boolean;
  density?: 'roomy' | 'condensed';
}) {
  const fieldId = useId();
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);

  const suggestions = value
    ? FRUITS.filter((fruit) =>
        fruit.toLowerCase().includes(value.toLowerCase()),
      )
    : [];

  return (
    <SearchInput.Root
      className="w-80"
      density={density}
      open={open && suggestions.length > 0}
      onOpenChange={setOpen}
    >
      <SearchInput.Label htmlFor={fieldId}>Search fruit</SearchInput.Label>
      <SearchInput.InputGroup>
        <SearchInput.Field
          id={fieldId}
          placeholder="Start typing a fruit..."
          value={value}
          disabled={disabled}
          onChange={(event) => {
            setValue(event.target.value);
            setOpen(true);
          }}
          iconEnd={
            value && (
              <SearchInput.ClearButton
                onClick={() => {
                  setValue('');
                  setOpen(false);
                }}
              />
            )
          }
        />
        <SearchInput.Button onClick={() => setOpen(false)}>
          Search
        </SearchInput.Button>
      </SearchInput.InputGroup>
      <SearchInput.Microcopy>
        Type to see live suggestions.
      </SearchInput.Microcopy>
      <SearchInput.Suggestions density={density}>
        {suggestions.map((fruit) => (
          <SearchInput.Option key={fruit} onSelect={() => setValue(fruit)}>
            {highlightMatch(fruit, value)}
          </SearchInput.Option>
        ))}
      </SearchInput.Suggestions>
    </SearchInput.Root>
  );
}

export const Playground: Story = {
  render: (args) => (
    <TypeAheadDemo disabled={args.disabled} density={args.density} />
  ),
};

export const Default: Story = {
  render: () => {
    function DefaultDemo() {
      const [value, setValue] = useState('');
      return (
        <SearchInput.Root className="w-80">
          <SearchInput.Label htmlFor="default-search">
            Search fruit
          </SearchInput.Label>
          <SearchInput.InputGroup>
            <SearchInput.Field
              id="default-search"
              placeholder="Search"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              iconEnd={
                value && (
                  <SearchInput.ClearButton onClick={() => setValue('')} />
                )
              }
            />
            <SearchInput.Button>Search</SearchInput.Button>
          </SearchInput.InputGroup>
          <SearchInput.Microcopy>This is helpful text.</SearchInput.Microcopy>
        </SearchInput.Root>
      );
    }
    return <DefaultDemo />;
  },
};

// No iconEnd override — Field's own default (`SearchInput.ClearButton
// disabled={disabled}`) already threads `disabled` through correctly, so
// this is the one story that needs no explicit wiring at all.
export const Disabled: Story = {
  render: () => (
    <SearchInput.Root className="w-80">
      <SearchInput.Label htmlFor="disabled-search">
        Search fruit
      </SearchInput.Label>
      <SearchInput.InputGroup>
        <SearchInput.Field
          id="disabled-search"
          placeholder="Search"
          defaultValue="Value"
          disabled
        />
        <SearchInput.Button disabled>Search</SearchInput.Button>
      </SearchInput.InputGroup>
      <SearchInput.Microcopy>This is helpful text.</SearchInput.Microcopy>
    </SearchInput.Root>
  ),
};

/**
 * A static, always-open drawer — unlike the Playground/TypeAheadDemo, the
 * options here aren't filtered by the field's value at all. Exists purely
 * to show the drawer's visual state (idle/hover option colors, container
 * border/radius) without wiring up real filtering logic.
 */
export const WithSuggestions: Story = {
  name: 'With open suggestions',
  render: () => {
    function WithSuggestionsDemo() {
      const [value, setValue] = useState('a');
      return (
        <SearchInput.Root className="w-80" defaultOpen>
          <SearchInput.Label htmlFor="open-search">
            Search fruit
          </SearchInput.Label>
          <SearchInput.InputGroup>
            <SearchInput.Field
              id="open-search"
              placeholder="Search"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              iconEnd={
                value && (
                  <SearchInput.ClearButton onClick={() => setValue('')} />
                )
              }
            />
            <SearchInput.Button>Search</SearchInput.Button>
          </SearchInput.InputGroup>
          <SearchInput.Suggestions
            onOpenAutoFocus={(event) => event.preventDefault()}
          >
            {FRUITS.filter((fruit) =>
              fruit.toLowerCase().includes(value.toLowerCase()),
            ).map((fruit) => (
              <SearchInput.Option key={fruit}>
                {highlightMatch(fruit, value)}
              </SearchInput.Option>
            ))}
          </SearchInput.Suggestions>
        </SearchInput.Root>
      );
    }
    return <WithSuggestionsDemo />;
  },
};

/**
 * The drawer's width clamps between two bounds: it's never narrower than
 * the field (`Suggestions`' `minWidth`, from Radix Popper's own trigger-
 * width tracking) and never wider than Root itself (`maxWidth`, from the
 * `ResizeObserver` in `SearchInput.Root` — see its comment for why). A
 * narrow Root plus a long option name exercises both bounds at once: the
 * option's own text wraps rather than pushing the drawer past Root's width.
 */
export const WidthClamp: Story = {
  name: 'Drawer width clamp',
  render: () => {
    function WidthClampDemo() {
      const [value, setValue] = useState('a');
      return (
        <SearchInput.Root className="w-64" defaultOpen>
          <SearchInput.Label htmlFor="clamp-search">
            Search fruit
          </SearchInput.Label>
          <SearchInput.InputGroup>
            <SearchInput.Field
              id="clamp-search"
              placeholder="Search"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              iconEnd={
                value && (
                  <SearchInput.ClearButton onClick={() => setValue('')} />
                )
              }
            />
            <SearchInput.Button>Search</SearchInput.Button>
          </SearchInput.InputGroup>
          <SearchInput.Suggestions
            onOpenAutoFocus={(event) => event.preventDefault()}
          >
            <SearchInput.Option>
              {highlightMatch(
                'A very long suggestion that would otherwise overflow',
                value,
              )}
            </SearchInput.Option>
            <SearchInput.Option>
              {highlightMatch('Apple', value)}
            </SearchInput.Option>
          </SearchInput.Suggestions>
        </SearchInput.Root>
      );
    }
    return <WidthClampDemo />;
  },
};

export const DensityComparison: Story = {
  name: 'Density comparison',
  render: () => (
    <div className="flex items-start gap-8">
      <div data-density="roomy" className="flex flex-col items-start gap-2">
        <TypeAheadDemo density="roomy" />
        <span className="text-xs">roomy</span>
      </div>
      <div data-density="condensed" className="flex flex-col items-start gap-2">
        <TypeAheadDemo density="condensed" />
        <span className="text-xs">condensed</span>
      </div>
    </div>
  ),
};

const HIGHLIGHT_EXAMPLES: Array<{ text: string; query: string }> = [
  { text: 'Banana', query: 'a' },
  { text: 'Mississippi', query: 'ss' },
  { text: 'Banana', query: 'ba' },
];

/**
 * `highlightMatch` (packages/ds/src/utils/highlight-match.tsx) isn't a
 * component — it's a plain exported DS utility any consumer can reach for
 * when rendering a filtered list, not just `SearchInput.Option`. This is
 * a sticker sheet, not an interactive demo: the same text/query pairs run
 * through both `occurrence` modes side by side, since the difference
 * between them (bold every match vs. just the first) is exactly the kind
 * of thing that's easier to see than to read about in the JSDoc.
 */
export const HighlightMatchUtility: Story = {
  name: 'highlightMatch utility (first vs all)',
  render: () => (
    <table className="border-collapse text-sm">
      <thead>
        <tr className="text-left">
          <th className="pr-8 pb-2 font-normal text-gray-500">Text</th>
          <th className="pr-8 pb-2 font-normal text-gray-500">Query</th>
          <th className="pr-8 pb-2 font-normal text-gray-500">
            occurrence: &quot;first&quot; (default)
          </th>
          <th className="pb-2 font-normal text-gray-500">
            occurrence: &quot;all&quot;
          </th>
        </tr>
      </thead>
      <tbody>
        {HIGHLIGHT_EXAMPLES.map(({ text, query }) => (
          <tr key={`${text}-${query}`}>
            <td className="pr-8 py-1">{text}</td>
            <td className="pr-8 py-1 font-mono">{query}</td>
            <td className="pr-8 py-1">{highlightMatch(text, query)}</td>
            <td className="py-1">
              {highlightMatch(text, query, { occurrence: 'all' })}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};
