import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar as AvatarIcon, BuildingGeneric } from 'icons';
import { Avatar } from './Avatar';
import type { AvatarSize } from './Avatar.types';

// Inline data URI so the "Contents=Image" story has zero network dependency
// (StackBlitz/WebContainers-friendly, per docs/PLAN.md's map-tile rationale).
const PLACEHOLDER_PHOTO =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23006DA3"/></svg>',
  );

const SIZES: AvatarSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

const meta = {
  title: 'Primitives/Avatar',
  component: Avatar.Root,
} satisfies Meta<typeof Avatar.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Image: Story = {
  render: () => (
    <Avatar.Root size="lg" variant="associate">
      <Avatar.Image src={PLACEHOLDER_PHOTO} alt="" />
      <Avatar.Fallback>WW</Avatar.Fallback>
    </Avatar.Root>
  ),
};

export const InitialsFallback: Story = {
  name: 'Fallback — Initials',
  render: () => (
    <Avatar.Root size="lg" variant="associate">
      <Avatar.Fallback>WW</Avatar.Fallback>
    </Avatar.Root>
  ),
};

export const IconFallback: Story = {
  name: 'Fallback — Icon (Associate)',
  render: () => (
    <Avatar.Root size="lg" variant="associate">
      <Avatar.Fallback>
        <AvatarIcon className="size-[var(--avatar-icon-size)]" />
      </Avatar.Fallback>
    </Avatar.Root>
  ),
};

export const EntityIconFallback: Story = {
  name: 'Fallback — Icon (Entity)',
  render: () => (
    <Avatar.Root size="lg" variant="entity">
      <Avatar.Fallback>
        <BuildingGeneric className="size-[var(--avatar-icon-size)]" />
      </Avatar.Fallback>
    </Avatar.Root>
  ),
};

export const AllSizes: Story = {
  name: 'Size scale (xs–2xl)',
  render: () => (
    <div className="flex items-end gap-4">
      {SIZES.map((size) => (
        <Avatar.Root key={size} size={size} variant="associate">
          <Avatar.Fallback>WW</Avatar.Fallback>
        </Avatar.Root>
      ))}
    </div>
  ),
};

export const AssociateVsEntity: Story = {
  name: 'Associate vs. Entity',
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar.Root size="lg" variant="associate">
        <Avatar.Fallback>WW</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root size="lg" variant="entity">
        <Avatar.Fallback>
          <BuildingGeneric className="size-[var(--avatar-icon-size)]" />
        </Avatar.Fallback>
      </Avatar.Root>
    </div>
  ),
};

/**
 * Avatar's sizing is a fixed step scale, not density-driven (see the
 * `density` prop note in Avatar.tsx) — this story exists to confirm that
 * fact visually: both densities should render identically.
 */
export const DensityComparison: Story = {
  name: 'Density comparison',
  render: () => (
    <div className="flex items-center gap-8">
      <div data-density="roomy" className="flex flex-col items-center gap-2">
        <Avatar.Root size="lg" variant="associate">
          <Avatar.Fallback>WW</Avatar.Fallback>
        </Avatar.Root>
        <span className="text-xs">roomy</span>
      </div>
      <div
        data-density="condensed"
        className="flex flex-col items-center gap-2"
      >
        <Avatar.Root size="lg" variant="associate">
          <Avatar.Fallback>WW</Avatar.Fallback>
        </Avatar.Root>
        <span className="text-xs">condensed</span>
      </div>
    </div>
  ),
};
