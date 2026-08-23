import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip } from './Chip';

const meta = {
  title: 'Primitives/Chip',
  component: Chip,
  argTypes: {
    className: { control: false, table: { disable: true } },
  },
  args: {
    children: 'Investors Nearing Retirement',
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const NonDismissible: Story = {
  args: {
    children: 'Investors Nearing Retirement',
  },
};

export const Dismissible: Story = {
  args: {
    children: 'Investors Nearing Retirement',
    onDismiss: () => {},
  },
};

// No Density story — Chip is deliberately not density-aware, same as Tag
// (docs/PLAN.md §1.6): no variant/size/density axis exists in Figma at all.

// A dismissible list, wired to real state — shows Chip's actual purpose
// (a removable filter) rather than a single static instance.
export const RemovableList: Story = {
  render: function Render() {
    const [chips, setChips] = useState([
      'Investors Nearing Retirement',
      'High Net Worth',
      'Recently Contacted',
    ]);
    return (
      <div className="flex flex-wrap items-center gap-2">
        {chips.map((label) => (
          <Chip
            key={label}
            onDismiss={() =>
              setChips((current) => current.filter((c) => c !== label))
            }
          >
            {label}
          </Chip>
        ))}
      </div>
    );
  },
};

// The compound Root/Label/CloseButton API, for wiring dismissal through
// onClick directly instead of the flat component's onDismiss prop.
export const Compound: Story = {
  render: () => (
    <Chip.Root>
      <Chip.Label>Verified</Chip.Label>
      <Chip.CloseButton aria-label="Remove Verified" onClick={() => {}} />
    </Chip.Root>
  ),
};
