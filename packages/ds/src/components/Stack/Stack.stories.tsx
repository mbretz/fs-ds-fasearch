import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from './Stack';
import { SPACING_SCALE } from '../../utils/spacing-scale';

const meta = {
  title: 'Layout/Stack',
  component: Stack,
  argTypes: {
    direction: { control: 'select', options: ['row', 'column'] },
    gap: { control: 'select', options: SPACING_SCALE },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch', 'baseline'],
    },
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
    },
    className: { control: false, table: { disable: true } },
  },
  args: {
    direction: 'column',
    gap: 'med',
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

const swatch = (label: string) => (
  <div key={label} className="bg-neutral-subtle p-2">
    {label}
  </div>
);

export const Playground: Story = {
  render: (args) => (
    <Stack {...args}>{['One', 'Two', 'Three'].map(swatch)}</Stack>
  ),
};

export const Row: Story = {
  args: { direction: 'row', gap: 'small' },
  render: (args) => (
    <Stack {...args}>{['One', 'Two', 'Three'].map(swatch)}</Stack>
  ),
};
