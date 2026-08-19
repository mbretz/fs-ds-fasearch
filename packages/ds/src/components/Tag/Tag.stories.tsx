import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckmarkCircle } from 'icons';
import { Tag } from './Tag';

const meta = {
  title: 'Primitives/Tag',
  component: Tag,
  argTypes: {
    variant: {
      control: 'select',
      options: ['generic', 'teal', 'red', 'gold'],
    },
    size: { control: 'select', options: ['sm', 'lg'] },
    borderWidth: { control: 'select', options: ['default', 'heavy'] },
    className: { control: false, table: { disable: true } },
  },
  args: {
    variant: 'generic',
    size: 'lg',
    children: 'Tag label',
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      {(['generic', 'teal', 'red', 'gold'] as const).map((variant) => (
        <Tag key={variant} variant={variant}>
          Tag label
        </Tag>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Tag size="lg">Large</Tag>
      <Tag size="sm">Small</Tag>
    </div>
  ),
};

// borderWidth's heavy step uses the fixed-border/inset-shadow trick, so both
// tags sit at the same height despite the visually thicker border.
export const BorderWidth: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Tag variant="teal" borderWidth="default">
        default
      </Tag>
      <Tag variant="teal" borderWidth="heavy">
        heavy
      </Tag>
    </div>
  ),
};

// No Density story — Tag is deliberately not density-aware (docs/PLAN.md
// §1.6, established 2026-08-19); `size` is its only sizing axis.

// The compound Root/Label API, for content around the label the flat <Tag>
// doesn't cover — extra elements are composed directly, no dedicated slot
// component (docs/FIGMA_COMPONENT_AUDIT.md's Tag entry).
export const Compound: Story = {
  render: () => (
    <Tag.Root variant="teal" asChild>
      <a href="#verified">
        <CheckmarkCircle className="size-[1em]" />
        <Tag.Label>Verified</Tag.Label>
      </a>
    </Tag.Root>
  ),
};
