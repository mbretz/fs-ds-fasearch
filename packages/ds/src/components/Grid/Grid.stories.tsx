import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid } from './Grid';
import { SPACING_SCALE } from '../../utils/spacing-scale';

const meta = {
  title: 'Layout/Grid',
  component: Grid,
  argTypes: {
    columns: { control: { type: 'number', min: 1, max: 6 } },
    gap: { control: 'select', options: SPACING_SCALE },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch'],
    },
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch'],
    },
    className: { control: false, table: { disable: true } },
  },
  args: {
    columns: 3,
    gap: 'med',
  },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

const cell = (label: string) => (
  <div key={label} className="bg-neutral-subtle p-2">
    {label}
  </div>
);

export const Playground: Story = {
  render: (args) => (
    <Grid {...args}>
      {['One', 'Two', 'Three', 'Four', 'Five', 'Six'].map(cell)}
    </Grid>
  ),
};

export const IndependentGaps: Story = {
  args: { columns: 3, columnGap: 'x-large', rowGap: 'x-small', gap: undefined },
  render: (args) => (
    <Grid {...args}>
      {['One', 'Two', 'Three', 'Four', 'Five', 'Six'].map(cell)}
    </Grid>
  ),
};
