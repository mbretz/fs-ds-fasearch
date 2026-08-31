import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from './Box';
import { SPACING_SCALE } from '../../utils/spacing-scale';

const meta = {
  title: 'Layout/Box',
  component: Box,
  argTypes: {
    padding: { control: 'select', options: SPACING_SCALE },
    className: { control: false, table: { disable: true } },
  },
  args: {
    padding: 'med',
  },
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Box {...args} className="bg-neutral-subtle">
      content
    </Box>
  ),
};

export const PaddingSteps: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      {SPACING_SCALE.map((step) => (
        <Box key={step} padding={step} className="bg-neutral-subtle">
          {step}
        </Box>
      ))}
    </div>
  ),
};
