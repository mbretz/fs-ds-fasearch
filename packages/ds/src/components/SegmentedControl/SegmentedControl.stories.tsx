import type { Meta, StoryObj } from '@storybook/react-vite';
import { List, MapPinLarge } from 'icons';
import { SegmentedControl } from './SegmentedControl';

// `density` lives on Root, no other single sub-part's own prop type covers
// the whole story surface — same reasoning as Tabs' own PlaygroundArgs.
interface PlaygroundArgs {
  density: 'roomy' | 'condensed';
  disabled: boolean;
}

const meta: Meta<PlaygroundArgs> = {
  title: 'Data display/SegmentedControl',
  component: SegmentedControl.Root,
  argTypes: {
    density: { control: 'radio', options: ['roomy', 'condensed'] },
    disabled: { control: 'boolean' },
  },
  args: {
    density: 'roomy',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// `disabled` toggles the Map segment — the other stays a fixed reference
// point so the effect is easy to compare against, same convention as Tabs'
// own Playground story.
export const Playground: Story = {
  render: ({ density, disabled }) => (
    <SegmentedControl.Root defaultValue="list" density={density}>
      <SegmentedControl.List>
        <SegmentedControl.Trigger value="list">List</SegmentedControl.Trigger>
        <SegmentedControl.Trigger value="map" disabled={disabled}>
          Map
        </SegmentedControl.Trigger>
      </SegmentedControl.List>
      <SegmentedControl.Content value="list" className="p-4">
        Store list view
      </SegmentedControl.Content>
      <SegmentedControl.Content value="map" className="p-4">
        Store map view
      </SegmentedControl.Content>
    </SegmentedControl.Root>
  ),
};

// Same underlying content (a store's results), switched between two
// formats — the case SegmentedControl is built for, distinct from Tabs
// switching between unrelated content (see SegmentedControl.types.ts).
export const Default: Story = {
  render: () => (
    <SegmentedControl.Root defaultValue="list">
      <SegmentedControl.List>
        <SegmentedControl.Trigger value="list">List</SegmentedControl.Trigger>
        <SegmentedControl.Trigger value="map">Map</SegmentedControl.Trigger>
      </SegmentedControl.List>
      <SegmentedControl.Content value="list" className="p-4">
        Store list view
      </SegmentedControl.Content>
      <SegmentedControl.Content value="map" className="p-4">
        Store map view
      </SegmentedControl.Content>
    </SegmentedControl.Root>
  ),
};

// Stretches to fill its container (typically a mobile-width layout) via
// plain utility overrides on the existing `className` escape hatch — `flex
// w-full` on List, `grow basis-0` on each Trigger — rather than a
// dedicated `fullWidth` prop, same as how Button's own full-width usage is
// just `className="w-full"` with no prop of its own.
export const FullWidth: Story = {
  name: 'Full width',
  render: () => (
    <SegmentedControl.Root defaultValue="list" className="w-80">
      <SegmentedControl.List className="flex w-full">
        <SegmentedControl.Trigger value="list" className="grow basis-0">
          List
        </SegmentedControl.Trigger>
        <SegmentedControl.Trigger value="map" className="grow basis-0">
          Map
        </SegmentedControl.Trigger>
      </SegmentedControl.List>
    </SegmentedControl.Root>
  ),
};

// Figma's `Show Icon Start` slot — each trigger gets a leading icon
// alongside its label via the `icon` prop.
export const WithIcons: Story = {
  name: 'With icons',
  render: () => (
    <SegmentedControl.Root defaultValue="list">
      <SegmentedControl.List>
        <SegmentedControl.Trigger value="list" icon={<List />}>
          List
        </SegmentedControl.Trigger>
        <SegmentedControl.Trigger value="map" icon={<MapPinLarge />}>
          Map
        </SegmentedControl.Trigger>
      </SegmentedControl.List>
    </SegmentedControl.Root>
  ),
};

export const Disabled: Story = {
  render: () => (
    <SegmentedControl.Root defaultValue="list">
      <SegmentedControl.List>
        <SegmentedControl.Trigger value="list">List</SegmentedControl.Trigger>
        <SegmentedControl.Trigger value="map" disabled>
          Map
        </SegmentedControl.Trigger>
      </SegmentedControl.List>
    </SegmentedControl.Root>
  ),
};

export const DensityComparison: Story = {
  name: 'Density comparison',
  render: () => (
    <div className="flex items-start gap-8">
      <div data-density="roomy" className="flex flex-col items-start gap-2">
        <SegmentedControl.Root defaultValue="list">
          <SegmentedControl.List>
            <SegmentedControl.Trigger value="list">
              List
            </SegmentedControl.Trigger>
            <SegmentedControl.Trigger value="map">Map</SegmentedControl.Trigger>
          </SegmentedControl.List>
        </SegmentedControl.Root>
        <span className="text-xs">roomy</span>
      </div>
      <div data-density="condensed" className="flex flex-col items-start gap-2">
        <SegmentedControl.Root defaultValue="list">
          <SegmentedControl.List>
            <SegmentedControl.Trigger value="list">
              List
            </SegmentedControl.Trigger>
            <SegmentedControl.Trigger value="map">Map</SegmentedControl.Trigger>
          </SegmentedControl.List>
        </SegmentedControl.Root>
        <span className="text-xs">condensed</span>
      </div>
    </div>
  ),
};
