import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextArea } from './TextArea';

const meta = {
  title: 'Primitives/TextArea',
  component: TextArea.Field,
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
    className: { control: false, table: { disable: true } },
    ref: { control: false, table: { disable: true } },
  },
  args: {
    error: false,
    disabled: false,
    readOnly: false,
    defaultValue: 'Value',
  },
} satisfies Meta<typeof TextArea.Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    defaultValue: '\n',
  },

  render: (args) => (
    <TextArea.Root className="w-64">
      <TextArea.Label htmlFor="playground-textarea" error={args.error}>
        Label
      </TextArea.Label>
      <TextArea.Field id="playground-textarea" {...args} />
      <TextArea.Microcopy error={args.error}>
        This is helpful text.
      </TextArea.Microcopy>
    </TextArea.Root>
  ),
};

export const Default: Story = {
  render: () => (
    <TextArea.Root className="w-64">
      <TextArea.Label htmlFor="default-textarea">Label</TextArea.Label>
      <TextArea.Field id="default-textarea" defaultValue="Value" />
      <TextArea.Microcopy>This is helpful text.</TextArea.Microcopy>
    </TextArea.Root>
  ),
};

export const Required: Story = {
  render: () => (
    <TextArea.Root className="w-64">
      <TextArea.Label htmlFor="required-textarea" requirement="required">
        Label
      </TextArea.Label>
      <TextArea.Field id="required-textarea" defaultValue="Value" />
    </TextArea.Root>
  ),
};

export const Error: Story = {
  render: () => (
    <TextArea.Root className="w-64">
      <TextArea.Label htmlFor="error-textarea" requirement="required" error>
        Label
      </TextArea.Label>
      <TextArea.Field id="error-textarea" defaultValue="Value" error />
      <TextArea.Microcopy error>This is helpful text.</TextArea.Microcopy>
    </TextArea.Root>
  ),
};

export const Disabled: Story = {
  render: () => (
    <TextArea.Root className="w-64">
      <TextArea.Label htmlFor="disabled-textarea">Label</TextArea.Label>
      <TextArea.Field id="disabled-textarea" defaultValue="Value" disabled />
      <TextArea.Microcopy>This is helpful text.</TextArea.Microcopy>
    </TextArea.Root>
  ),
};

export const ReadOnly: Story = {
  name: 'Read-only',
  render: () => (
    <TextArea.Root className="w-64">
      <TextArea.Label htmlFor="readonly-textarea">Label</TextArea.Label>
      <TextArea.Field id="readonly-textarea" defaultValue="Value" readOnly />
    </TextArea.Root>
  ),
};

export const Controlled: Story = {
  name: 'Controlled (uncomposed Field)',
  render: () => {
    function ControlledField() {
      const [value, setValue] = useState('');
      return (
        <TextArea.Field
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
      <TextArea.Root className="w-64">
        <TextArea.Label htmlFor="s-default">Label</TextArea.Label>
        <TextArea.Field id="s-default" defaultValue="Value" />
        <TextArea.Microcopy>This is helpful text.</TextArea.Microcopy>
      </TextArea.Root>
      <TextArea.Root className="w-64">
        <TextArea.Label htmlFor="s-error" requirement="required" error>
          Label
        </TextArea.Label>
        <TextArea.Field id="s-error" defaultValue="Value" error />
        <TextArea.Microcopy error>This is helpful text.</TextArea.Microcopy>
      </TextArea.Root>
      <TextArea.Root className="w-64">
        <TextArea.Label htmlFor="s-disabled">Label</TextArea.Label>
        <TextArea.Field id="s-disabled" defaultValue="Value" disabled />
        <TextArea.Microcopy>This is helpful text.</TextArea.Microcopy>
      </TextArea.Root>
      <TextArea.Root className="w-64">
        <TextArea.Label htmlFor="s-readonly">Label</TextArea.Label>
        <TextArea.Field id="s-readonly" defaultValue="Value" readOnly />
      </TextArea.Root>
    </div>
  ),
};

export const DensityComparison: Story = {
  name: 'Density comparison',
  render: () => (
    <div className="flex items-start gap-8">
      <div data-density="roomy" className="flex flex-col items-start gap-2">
        <TextArea.Root className="w-64">
          <TextArea.Label htmlFor="d-roomy">Label</TextArea.Label>
          <TextArea.Field id="d-roomy" defaultValue="Value" />
        </TextArea.Root>
        <span className="text-xs">roomy</span>
      </div>
      <div data-density="condensed" className="flex flex-col items-start gap-2">
        <TextArea.Root className="w-64">
          <TextArea.Label htmlFor="d-condensed">Label</TextArea.Label>
          <TextArea.Field id="d-condensed" defaultValue="Value" />
        </TextArea.Root>
        <span className="text-xs">condensed</span>
      </div>
    </div>
  ),
};
