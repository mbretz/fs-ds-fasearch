import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from './Label';

const meta = {
  title: 'Primitives/Label',
  component: Label,
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Label>Label</Label>,
};

export const Required: Story = {
  render: () => <Label requirement="required">Label</Label>,
};

export const Optional: Story = {
  render: () => <Label requirement="optional">Label</Label>,
};

export const ErrorDefault: Story = {
  name: 'Error — Default',
  render: () => <Label error>Label</Label>,
};

export const ErrorRequired: Story = {
  name: 'Error — Required',
  render: () => (
    <Label error requirement="required">
      Label
    </Label>
  ),
};

export const ErrorOptional: Story = {
  name: 'Error — Optional',
  render: () => (
    <Label error requirement="optional">
      Label
    </Label>
  ),
};

export const AllStates: Story = {
  name: 'All 6 states sticker sheet',
  render: () => (
    <div className="flex flex-col gap-4">
      <Label>Label</Label>
      <Label requirement="required">Label</Label>
      <Label requirement="optional">Label</Label>
      <Label error>Label</Label>
      <Label error requirement="required">
        Label
      </Label>
      <Label error requirement="optional">
        Label
      </Label>
    </div>
  ),
};

/**
 * Label has no `density` prop (see Label.tsx) — this story exists to
 * confirm that fact visually, same reasoning as Avatar's density story:
 * both densities should render identically since no
 * `component-label-*` token has a density override.
 */
export const DensityComparison: Story = {
  name: 'Density comparison',
  render: () => (
    <div className="flex items-center gap-8">
      <div data-density="roomy" className="flex flex-col items-start gap-2">
        <Label requirement="required">Label</Label>
        <span className="text-xs">roomy</span>
      </div>
      <div data-density="condensed" className="flex flex-col items-start gap-2">
        <Label requirement="required">Label</Label>
        <span className="text-xs">condensed</span>
      </div>
    </div>
  ),
};
