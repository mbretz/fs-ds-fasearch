import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChecklistGroup } from './ChecklistGroup';

const meta = {
  title: 'Primitives/ChecklistGroup',
  component: ChecklistGroup.Group,
  argTypes: {
    error: { control: 'boolean' },
    className: { control: false, table: { disable: true } },
  },
  args: {
    error: false,
  },
} satisfies Meta<typeof ChecklistGroup.Group>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <ChecklistGroup.Root className="w-72">
      <ChecklistGroup.Label error={args.error} requirement="required">
        Select one or more options.
      </ChecklistGroup.Label>
      <ChecklistGroup.Group {...args}>
        <ChecklistGroup.Item>Value</ChecklistGroup.Item>
        <ChecklistGroup.Item>Value</ChecklistGroup.Item>
      </ChecklistGroup.Group>
      <ChecklistGroup.Microcopy error={args.error}>
        This is helpful text
      </ChecklistGroup.Microcopy>
    </ChecklistGroup.Root>
  ),
};

export const NestedPlayground: Story = {
  render: (args) => <NestedSelectAllExample error={args.error} />,
};

export const Default: Story = {
  render: () => (
    <ChecklistGroup.Root className="w-72">
      <ChecklistGroup.Label requirement="required">
        Select one or more options.
      </ChecklistGroup.Label>
      <ChecklistGroup.Group>
        <ChecklistGroup.Item>Value</ChecklistGroup.Item>
        <ChecklistGroup.Item>Value</ChecklistGroup.Item>
      </ChecklistGroup.Group>
      <ChecklistGroup.Microcopy>This is helpful text</ChecklistGroup.Microcopy>
    </ChecklistGroup.Root>
  ),
};

export const ErrorState: Story = {
  render: () => (
    <ChecklistGroup.Root className="w-72">
      <ChecklistGroup.Label error requirement="required">
        Select one or more options.
      </ChecklistGroup.Label>
      <ChecklistGroup.Group error>
        <ChecklistGroup.Item>Value</ChecklistGroup.Item>
        <ChecklistGroup.Item>Value</ChecklistGroup.Item>
      </ChecklistGroup.Group>
      <ChecklistGroup.Microcopy error>
        This is helpful text
      </ChecklistGroup.Microcopy>
    </ChecklistGroup.Root>
  ),
};

// Classic "select all" sync: parent checked/indeterminate is derived from
// children, clicking the parent bulk-sets all of them. Consumer-owned state,
// not built into ChecklistGroup — neither Figma nor Radix models this.
function NestedSelectAllExample({ error = false }: { error?: boolean }) {
  const [children, setChildren] = useState({ a: false, b: false });
  const values = Object.values(children);
  const parentChecked: boolean | 'indeterminate' = values.every(Boolean)
    ? true
    : values.some(Boolean)
      ? 'indeterminate'
      : false;

  return (
    <ChecklistGroup.Root className="w-72">
      <ChecklistGroup.Label error={error} requirement="required">
        Select one or more options.
      </ChecklistGroup.Label>
      <ChecklistGroup.Group error={error}>
        <ChecklistGroup.Item
          checked={parentChecked}
          onCheckedChange={(checked) =>
            setChildren({ a: checked === true, b: checked === true })
          }
        >
          Select all
        </ChecklistGroup.Item>
        <ChecklistGroup.NestedGroup>
          <ChecklistGroup.Item
            checked={children.a}
            onCheckedChange={(checked) =>
              setChildren((prev) => ({ ...prev, a: checked === true }))
            }
          >
            Value A
          </ChecklistGroup.Item>
          <ChecklistGroup.Item
            checked={children.b}
            onCheckedChange={(checked) =>
              setChildren((prev) => ({ ...prev, b: checked === true }))
            }
          >
            Value B
          </ChecklistGroup.Item>
        </ChecklistGroup.NestedGroup>
      </ChecklistGroup.Group>
      <ChecklistGroup.Microcopy error={error}>
        This is helpful text
      </ChecklistGroup.Microcopy>
    </ChecklistGroup.Root>
  );
}

export const Nested: Story = {
  render: () => <NestedSelectAllExample />,
};

export const FitContent: Story = {
  // No explicit width on Root, short label: the default case most
  // consumers hit — the bordered Group box hugs its widest item, not the
  // full container. Compare against Playground/Default/ErrorState (which
  // pass className="w-72") for the fill-container treatment, and LongLabel
  // for the case where the label itself is the widest content.
  render: () => (
    <ChecklistGroup.Root>
      <ChecklistGroup.Label error requirement="required">
        Select one.
      </ChecklistGroup.Label>
      <ChecklistGroup.Group error>
        <ChecklistGroup.Item>A</ChecklistGroup.Item>
        <ChecklistGroup.Item>B</ChecklistGroup.Item>
      </ChecklistGroup.Group>
      <ChecklistGroup.Microcopy error>This is helpful text</ChecklistGroup.Microcopy>
    </ChecklistGroup.Root>
  ),
};

export const LongLabel: Story = {
  render: () => (
    <ChecklistGroup.Root>
      <ChecklistGroup.Label error requirement="required">
        This label is intentionally much longer than either checklist item
        below it.
      </ChecklistGroup.Label>
      <ChecklistGroup.Group error>
        <ChecklistGroup.Item>A</ChecklistGroup.Item>
        <ChecklistGroup.Item>B</ChecklistGroup.Item>
      </ChecklistGroup.Group>
      <ChecklistGroup.Microcopy error>
        This is helpful text
      </ChecklistGroup.Microcopy>
    </ChecklistGroup.Root>
  ),
};
