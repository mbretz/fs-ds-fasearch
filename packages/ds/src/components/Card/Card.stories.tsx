import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckmarkCircle } from 'icons';
import { Card } from './Card';
import { Button } from '../Button/Button';
import { Tag } from '../Tag/Tag';

// Root/Header/Body/Footer span the compound API, so meta isn't bound to a
// single sub-part's own prop type via `satisfies Meta<typeof X>` — same
// reasoning as Tabs' story meta.
interface PlaygroundArgs {
  expandable: boolean;
  showBorder: boolean;
  defaultOpen: boolean;
  density: 'roomy' | 'condensed';
}

const meta: Meta<PlaygroundArgs> = {
  title: 'Layout/Card',
  component: Card.Root,
  argTypes: {
    expandable: { control: 'boolean' },
    showBorder: { control: 'boolean' },
    defaultOpen: { control: 'boolean' },
    density: { control: 'radio', options: ['roomy', 'condensed'] },
  },
  args: {
    expandable: true,
    showBorder: true,
    defaultOpen: true,
    density: 'roomy',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: ({ expandable, showBorder, defaultOpen, density }) => (
    <Card.Root defaultOpen={defaultOpen} density={density} className="w-80">
      <Card.Header expandable={expandable} showBorder={showBorder}>
        <Card.HeaderTitle icon={<CheckmarkCircle />}>
          Card Title
        </Card.HeaderTitle>
        <Card.HeaderDescription>Description</Card.HeaderDescription>
      </Card.Header>
      <Card.Body>Body content goes here.</Card.Body>
      <Card.Footer>Footer content goes here.</Card.Footer>
    </Card.Root>
  ),
};

// A card with no expand affordance at all — Header renders as a plain div,
// Body/Footer are always visible (Root defaults `defaultOpen` to true).
export const NonExpandable: Story = {
  render: () => (
    <Card.Root className="w-80">
      <Card.Header>
        <Card.HeaderTitle icon={<CheckmarkCircle />}>
          Card Title
        </Card.HeaderTitle>
      </Card.Header>
      <Card.Body>Body content goes here.</Card.Body>
    </Card.Root>
  ),
};

// Header is the whole-row Collapsible trigger; Body and Footer stay
// mounted in the DOM at all times and collapse together via a shared CSS
// grid-rows animation, rather than unmounting (confirmed with the user).
export const Expandable: Story = {
  render: () => (
    <Card.Root defaultOpen={false} className="w-80">
      <Card.Header expandable>
        <Card.HeaderTitle icon={<CheckmarkCircle />}>
          Card Title
        </Card.HeaderTitle>
        <Card.HeaderDescription>Description</Card.HeaderDescription>
      </Card.Header>
      <Card.Body>Body content goes here.</Card.Body>
      <Card.Footer>Footer content goes here.</Card.Footer>
    </Card.Root>
  ),
};

export const WithoutIcon: Story = {
  render: () => (
    <Card.Root defaultOpen={false} className="w-80">
      <Card.Header expandable>
        <Card.HeaderTitle>Card Title</Card.HeaderTitle>
        <Card.HeaderDescription>Description</Card.HeaderDescription>
      </Card.Header>
      <Card.Body>Body content goes here.</Card.Body>
    </Card.Root>
  ),
};

export const DensityComparison: Story = {
  name: 'Density comparison',
  render: () => (
    <div className="flex items-start gap-8">
      <div data-density="roomy" className="flex flex-col items-start gap-2">
        <Card.Root className="w-80">
          <Card.Header>
            <Card.HeaderTitle icon={<CheckmarkCircle />}>
              Card Title
            </Card.HeaderTitle>
          </Card.Header>
          <Card.Body>Body content goes here.</Card.Body>
          <Card.Footer>Footer content goes here.</Card.Footer>
        </Card.Root>
        <span className="text-xs">roomy</span>
      </div>
      <div data-density="condensed" className="flex flex-col items-start gap-2">
        <Card.Root className="w-80">
          <Card.Header>
            <Card.HeaderTitle icon={<CheckmarkCircle />}>
              Card Title
            </Card.HeaderTitle>
          </Card.Header>
          <Card.Body>Body content goes here.</Card.Body>
          <Card.Footer>Footer content goes here.</Card.Footer>
        </Card.Root>
        <span className="text-xs">condensed</span>
      </div>
    </div>
  ),
};

// Card has no flat convenience wrapper — Root/Header/HeaderTitle/
// HeaderDescription/Body/Footer are the only API. This story is about
// what the compound pieces let a consumer build beyond the plain-text
// Playground default: real content composed into Body (a Tag alongside
// text) and Footer (two Buttons), not just strings.
export const Compound: Story = {
  args: {
    density: 'roomy',
    showBorder: false,
  },

  render: () => (
    <Card.Root className="w-80">
      <Card.Header expandable>
        <Card.HeaderTitle icon={<CheckmarkCircle />}>
          Account verified
        </Card.HeaderTitle>
        <Card.HeaderDescription>
          <span style={{ color: 'blue' }}>Pending</span>
        </Card.HeaderDescription>
      </Card.Header>
      <Card.Body>
        <p>Your account has been verified and is ready to use.</p>
        <Tag.Root variant="teal" size="sm">
          <Tag.Label>Active</Tag.Label>
        </Tag.Root>
      </Card.Body>
      <Card.Footer>
        <div className="flex justify-end gap-2">
          <Button variant="secondary">Dismiss</Button>
          <Button variant="primary">Continue</Button>
        </div>
      </Card.Footer>
    </Card.Root>
  ),
};
