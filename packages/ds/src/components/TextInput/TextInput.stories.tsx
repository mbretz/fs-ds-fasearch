import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CaretDown, Search } from 'icons';
import { TextInput } from './TextInput';

const meta = {
  title: 'Primitives/TextInput',
  component: TextInput.Field,
  argTypes: {
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    density: {
      control: 'radio',
      options: ['roomy', 'condensed'],
      description: 'Explicit override; omit to inherit from data-density.',
    },
    defaultValue: { control: 'text' },
    placeholder: { control: 'text' },
    // Icon/className/ref aren't Controls-friendly (ReactNode/string/ref) —
    // hidden from the panel rather than left to render as broken widgets.
    iconStart: { control: false, table: { disable: true } },
    iconEnd: { control: false, table: { disable: true } },
    className: { control: false, table: { disable: true } },
    ref: { control: false, table: { disable: true } },
  },
  args: {
    error: false,
    disabled: false,
    readOnly: false,
    defaultValue: 'Value',
  },
} satisfies Meta<typeof TextInput.Field>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The interactive story — toggle error/disabled/readOnly/density from
 * the Controls panel and see Label + Field + Microcopy react together,
 * same as they would wired to real form-validation state. Every other
 * story below fixes a specific state as a visual/named reference and
 * intentionally doesn't take args, matching the fixed-state stories
 * already established for Avatar/Label.
 */
export const Playground: Story = {
  render: (args) => (
    <TextInput.Root className="w-64">
      <TextInput.Label htmlFor="playground-input" error={args.error}>
        Label
      </TextInput.Label>
      <TextInput.Field id="playground-input" {...args} />
      <TextInput.Microcopy error={args.error}>
        This is helpful text.
      </TextInput.Microcopy>
    </TextInput.Root>
  ),
};

export const Default: Story = {
  render: () => (
    <TextInput.Root className="w-64">
      <TextInput.Label htmlFor="default-input">Label</TextInput.Label>
      <TextInput.Field id="default-input" defaultValue="Value" />
      <TextInput.Microcopy>This is helpful text.</TextInput.Microcopy>
    </TextInput.Root>
  ),
};

export const Required: Story = {
  render: () => (
    <TextInput.Root className="w-64">
      <TextInput.Label htmlFor="required-input" requirement="required">
        Label
      </TextInput.Label>
      <TextInput.Field id="required-input" defaultValue="Value" />
    </TextInput.Root>
  ),
};

export const Error: Story = {
  render: () => (
    <TextInput.Root className="w-64">
      <TextInput.Label htmlFor="error-input" requirement="required" error>
        Label
      </TextInput.Label>
      <TextInput.Field id="error-input" defaultValue="Value" error />
      <TextInput.Microcopy error>This is helpful text.</TextInput.Microcopy>
    </TextInput.Root>
  ),
};

export const Disabled: Story = {
  render: () => (
    <TextInput.Root className="w-64">
      <TextInput.Label htmlFor="disabled-input">Label</TextInput.Label>
      <TextInput.Field id="disabled-input" defaultValue="Value" disabled />
      <TextInput.Microcopy>This is helpful text.</TextInput.Microcopy>
    </TextInput.Root>
  ),
};

export const ReadOnly: Story = {
  name: 'Read-only',
  render: () => (
    <TextInput.Root className="w-64">
      <TextInput.Label htmlFor="readonly-input">Label</TextInput.Label>
      <TextInput.Field id="readonly-input" defaultValue="Value" readOnly />
    </TextInput.Root>
  ),
};

/**
 * Figma's Active state (focus) is pure `focus-within:` CSS on the
 * wrapper div, not a prop — it fires off real DOM focus on the
 * underlying `<input>`, which `ref` forwards to directly, so both
 * keyboard Tab and programmatic `.focus()` trigger it identically to
 * clicking. Two fields plus a "Focus second field" button demonstrate
 * all three paths: Tab from the first field, click into either, or
 * press the button to focus programmatically via ref.
 */
export const Focus: Story = {
  name: 'Active (focus)',
  render: () => {
    function FocusDemo() {
      const secondFieldRef = useRef<HTMLInputElement>(null);
      return (
        <div className="flex flex-col items-start gap-4">
          <TextInput.Root className="w-64">
            <TextInput.Label htmlFor="focus-input-1">
              First field (Tab from here)
            </TextInput.Label>
            <TextInput.Field id="focus-input-1" defaultValue="Value" />
          </TextInput.Root>
          <TextInput.Root className="w-64">
            <TextInput.Label htmlFor="focus-input-2">
              Second field
            </TextInput.Label>
            <TextInput.Field
              id="focus-input-2"
              ref={secondFieldRef}
              defaultValue="Value"
            />
          </TextInput.Root>
          <button
            type="button"
            className="text-sm underline"
            onClick={() => secondFieldRef.current?.focus()}
          >
            Focus second field programmatically
          </button>
        </div>
      );
    }
    return <FocusDemo />;
  },
};

export const IconStart: Story = {
  name: 'With icon start',
  render: () => (
    <TextInput.Root className="w-64">
      <TextInput.Label htmlFor="icon-start-input">Label</TextInput.Label>
      <TextInput.Field
        id="icon-start-input"
        defaultValue="Value"
        iconStart={<Search />}
      />
    </TextInput.Root>
  ),
};

export const IconEnd: Story = {
  name: 'With icon end',
  render: () => (
    <TextInput.Root className="w-64">
      <TextInput.Label htmlFor="icon-end-input">Label</TextInput.Label>
      <TextInput.Field
        id="icon-end-input"
        defaultValue="Value"
        iconEnd={<CaretDown />}
      />
    </TextInput.Root>
  ),
};

export const Controlled: Story = {
  name: 'Controlled (uncomposed Field)',
  render: () => {
    function ControlledField() {
      const [value, setValue] = useState('');
      return (
        <TextInput.Field
          className="w-64"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Type something"
        />
      );
    }
    return <ControlledField />;
  },
};

export const AllStates: Story = {
  name: 'All states sticker sheet',
  render: () => (
    <div className="flex flex-wrap gap-6">
      <TextInput.Root className="w-64">
        <TextInput.Label htmlFor="s-default">Label</TextInput.Label>
        <TextInput.Field id="s-default" defaultValue="Value" />
        <TextInput.Microcopy>This is helpful text.</TextInput.Microcopy>
      </TextInput.Root>
      <TextInput.Root className="w-64">
        <TextInput.Label htmlFor="s-error" requirement="required" error>
          Label
        </TextInput.Label>
        <TextInput.Field id="s-error" defaultValue="Value" error />
        <TextInput.Microcopy error>This is helpful text.</TextInput.Microcopy>
      </TextInput.Root>
      <TextInput.Root className="w-64">
        <TextInput.Label htmlFor="s-disabled">Label</TextInput.Label>
        <TextInput.Field id="s-disabled" defaultValue="Value" disabled />
        <TextInput.Microcopy>This is helpful text.</TextInput.Microcopy>
      </TextInput.Root>
      <TextInput.Root className="w-64">
        <TextInput.Label htmlFor="s-readonly">Label</TextInput.Label>
        <TextInput.Field id="s-readonly" defaultValue="Value" readOnly />
      </TextInput.Root>
    </div>
  ),
};

export const DensityComparison: Story = {
  name: 'Density comparison',
  render: () => (
    <div className="flex items-start gap-8">
      <div data-density="roomy" className="flex flex-col items-start gap-2">
        <TextInput.Root className="w-64">
          <TextInput.Label htmlFor="d-roomy">Label</TextInput.Label>
          <TextInput.Field id="d-roomy" defaultValue="Value" />
        </TextInput.Root>
        <span className="text-xs">roomy</span>
      </div>
      <div
        data-density="condensed"
        className="flex flex-col items-start gap-2"
      >
        <TextInput.Root className="w-64">
          <TextInput.Label htmlFor="d-condensed">Label</TextInput.Label>
          <TextInput.Field id="d-condensed" defaultValue="Value" />
        </TextInput.Root>
        <span className="text-xs">condensed</span>
      </div>
    </div>
  ),
};
