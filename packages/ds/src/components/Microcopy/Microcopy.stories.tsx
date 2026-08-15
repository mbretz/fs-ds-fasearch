import type { Meta, StoryObj } from '@storybook/react-vite';
import { Microcopy } from './Microcopy';

const meta = {
  title: 'Primitives/Microcopy',
  component: Microcopy,
} satisfies Meta<typeof Microcopy>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Microcopy>This is helpful text.</Microcopy>,
};

export const Error: Story = {
  render: () => <Microcopy error>This is helpful text.</Microcopy>,
};

export const AllStates: Story = {
  name: 'All states sticker sheet',
  render: () => (
    <div className="flex flex-col gap-4">
      <Microcopy>This is helpful text.</Microcopy>
      <Microcopy error>This is helpful text.</Microcopy>
    </div>
  ),
};

/**
 * Microcopy has no `density` prop, same reasoning as Label — it reuses
 * `component-label-*` tokens, which have no density-mode overrides.
 */
export const DensityComparison: Story = {
  name: 'Density comparison',
  render: () => (
    <div className="flex items-center gap-8">
      <div data-density="roomy" className="flex flex-col items-start gap-2">
        <Microcopy>This is helpful text.</Microcopy>
        <span className="text-xs">roomy</span>
      </div>
      <div data-density="condensed" className="flex flex-col items-start gap-2">
        <Microcopy>This is helpful text.</Microcopy>
        <span className="text-xs">condensed</span>
      </div>
    </div>
  ),
};
