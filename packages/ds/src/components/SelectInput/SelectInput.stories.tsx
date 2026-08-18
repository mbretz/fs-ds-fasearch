import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SelectInput } from './SelectInput';

const meta = {
  title: 'Primitives/SelectInput',
  component: SelectInput.Trigger,
  argTypes: {
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    density: {
      control: 'radio',
      options: ['roomy', 'condensed'],
      description: 'Explicit override; omit to inherit from data-density.',
    },
    placeholder: { control: 'text' },
    className: { control: false, table: { disable: true } },
  },
  args: {
    error: false,
    disabled: false,
    readOnly: false,
    placeholder: 'Select an option',
  },
} satisfies Meta<typeof SelectInput.Trigger>;

export default meta;
type Story = StoryObj<typeof meta>;

function Options() {
  return (
    <>
      <SelectInput.Option value="apple">Apple</SelectInput.Option>
      <SelectInput.Option value="banana">Banana</SelectInput.Option>
      <SelectInput.Option value="cherry">Cherry</SelectInput.Option>
    </>
  );
}

export const Playground: Story = {
  render: (args) => (
    <SelectInput.Root className="w-64">
      <SelectInput.Label htmlFor="playground-select" error={args.error}>
        Label
      </SelectInput.Label>
      <SelectInput.Trigger id="playground-select" {...args} />
      <SelectInput.Content>
        <Options />
      </SelectInput.Content>
      <SelectInput.Microcopy error={args.error}>
        This is helpful text.
      </SelectInput.Microcopy>
    </SelectInput.Root>
  ),
};

export const Default: Story = {
  render: () => (
    <SelectInput.Root className="w-64">
      <SelectInput.Label htmlFor="default-select">Label</SelectInput.Label>
      <SelectInput.Trigger id="default-select" placeholder="Select an option" />
      <SelectInput.Content>
        <Options />
      </SelectInput.Content>
      <SelectInput.Microcopy>This is helpful text.</SelectInput.Microcopy>
    </SelectInput.Root>
  ),
};

export const Required: Story = {
  render: () => (
    <SelectInput.Root className="w-64">
      <SelectInput.Label htmlFor="required-select" requirement="required">
        Label
      </SelectInput.Label>
      <SelectInput.Trigger
        id="required-select"
        placeholder="Select an option"
      />
      <SelectInput.Content>
        <Options />
      </SelectInput.Content>
    </SelectInput.Root>
  ),
};

export const Error: Story = {
  render: () => (
    <SelectInput.Root className="w-64">
      <SelectInput.Label htmlFor="error-select" requirement="required" error>
        Label
      </SelectInput.Label>
      <SelectInput.Trigger
        id="error-select"
        error
        placeholder="Select an option"
      />
      <SelectInput.Content>
        <Options />
      </SelectInput.Content>
      <SelectInput.Microcopy error>This is helpful text.</SelectInput.Microcopy>
    </SelectInput.Root>
  ),
};

export const Disabled: Story = {
  render: () => (
    <SelectInput.Root className="w-64">
      <SelectInput.Label htmlFor="disabled-select">Label</SelectInput.Label>
      <SelectInput.Trigger
        id="disabled-select"
        disabled
        placeholder="Select an option"
      />
      <SelectInput.Content>
        <Options />
      </SelectInput.Content>
      <SelectInput.Microcopy>This is helpful text.</SelectInput.Microcopy>
    </SelectInput.Root>
  ),
};

export const ReadOnly: Story = {
  name: 'Read-only',
  render: () => (
    <SelectInput.Root className="w-64" defaultValue="apple">
      <SelectInput.Label htmlFor="readonly-select">Label</SelectInput.Label>
      <SelectInput.Trigger id="readonly-select" readOnly />
      <SelectInput.Content>
        <Options />
      </SelectInput.Content>
    </SelectInput.Root>
  ),
};

export const Controlled: Story = {
  name: 'Controlled (uncomposed Root)',
  render: () => {
    function ControlledSelect() {
      const [value, setValue] = useState<string>('');
      return (
        <SelectInput.Root
          className="w-64"
          value={value}
          onValueChange={setValue}
        >
          <SelectInput.Trigger placeholder="Select a fruit" />
          <SelectInput.Content>
            <Options />
          </SelectInput.Content>
        </SelectInput.Root>
      );
    }
    return <ControlledSelect />;
  },
};

export const AllStates: Story = {
  name: 'All states sticker sheet',
  render: () => (
    <div className="flex flex-wrap gap-6">
      <SelectInput.Root className="w-64">
        <SelectInput.Label htmlFor="s-default">Label</SelectInput.Label>
        <SelectInput.Trigger id="s-default" placeholder="Select an option" />
        <SelectInput.Content>
          <Options />
        </SelectInput.Content>
        <SelectInput.Microcopy>This is helpful text.</SelectInput.Microcopy>
      </SelectInput.Root>
      <SelectInput.Root className="w-64">
        <SelectInput.Label htmlFor="s-error" requirement="required" error>
          Label
        </SelectInput.Label>
        <SelectInput.Trigger
          id="s-error"
          error
          placeholder="Select an option"
        />
        <SelectInput.Content>
          <Options />
        </SelectInput.Content>
        <SelectInput.Microcopy error>
          This is helpful text.
        </SelectInput.Microcopy>
      </SelectInput.Root>
      <SelectInput.Root className="w-64">
        <SelectInput.Label htmlFor="s-disabled">Label</SelectInput.Label>
        <SelectInput.Trigger
          id="s-disabled"
          disabled
          placeholder="Select an option"
        />
        <SelectInput.Content>
          <Options />
        </SelectInput.Content>
        <SelectInput.Microcopy>This is helpful text.</SelectInput.Microcopy>
      </SelectInput.Root>
      <SelectInput.Root className="w-64" defaultValue="apple">
        <SelectInput.Label htmlFor="s-readonly">Label</SelectInput.Label>
        <SelectInput.Trigger id="s-readonly" readOnly />
        <SelectInput.Content>
          <Options />
        </SelectInput.Content>
      </SelectInput.Root>
    </div>
  ),
};

export const DensityComparison: Story = {
  name: 'Density comparison',
  render: () => (
    <div className="flex items-start gap-8">
      <div data-density="roomy" className="flex flex-col items-start gap-2">
        <SelectInput.Root className="w-64">
          <SelectInput.Label htmlFor="d-roomy">Label</SelectInput.Label>
          <SelectInput.Trigger id="d-roomy" placeholder="Select an option" />
          <SelectInput.Content density="roomy">
            <Options />
          </SelectInput.Content>
        </SelectInput.Root>
        <span className="text-xs">roomy</span>
      </div>
      <div data-density="condensed" className="flex flex-col items-start gap-2">
        <SelectInput.Root className="w-64">
          <SelectInput.Label htmlFor="d-condensed">Label</SelectInput.Label>
          <SelectInput.Trigger
            id="d-condensed"
            placeholder="Select an option"
          />
          <SelectInput.Content density="condensed">
            <Options />
          </SelectInput.Content>
        </SelectInput.Root>
        <span className="text-xs">condensed</span>
      </div>
    </div>
  ),
};
