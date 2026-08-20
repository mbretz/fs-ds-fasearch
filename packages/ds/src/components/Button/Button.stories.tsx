import type { Meta, StoryObj } from '@storybook/react-vite';
import { RefreshSync, ProtectionShield, Close } from 'icons';
import { Button } from './Button';

const meta = {
  title: 'Primitives/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
    },
    destructive: { control: 'boolean' },
    showLabel: { control: 'boolean' },
    disabled: { control: 'boolean' },
    iconStart: { control: false, table: { disable: true } },
    iconEnd: { control: false, table: { disable: true } },
    className: { control: false, table: { disable: true } },
    'aria-label': {
      control: 'text',
      description:
        'Overrides the accessible name. Set this when the visible label doesn’t fully describe the action in context, or when `showLabel` is false and the icon alone isn’t enough.',
    },
  },
  args: {
    variant: 'primary',
    destructive: false,
    showLabel: true,
    disabled: false,
    children: 'Button label',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      {(['primary', 'secondary', 'tertiary'] as const).map((variant) => (
        <div key={variant} className="flex items-center gap-3">
          <Button variant={variant}>Button label</Button>
          <Button variant={variant} iconStart={<RefreshSync />}>
            Button label
          </Button>
          <Button variant={variant} iconEnd={<ProtectionShield />}>
            Button label
          </Button>
        </div>
      ))}
    </div>
  ),
};

export const Destructive: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-3">
      {(['primary', 'secondary', 'tertiary'] as const).map((variant) => (
        <Button key={variant} variant={variant} destructive>
          Button label
        </Button>
      ))}
    </div>
  ),
};

// showLabel=false: children stays mounted (sr-only) as the default
// accessible name. aria-label overrides it for the rare case that needs
// screen-reader text different from the visible-when-shown label.
export const IconOnly: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      {(['primary', 'secondary', 'tertiary'] as const).map((variant) => (
        <Button
          key={variant}
          variant={variant}
          showLabel={false}
          iconStart={<Close />}
        >
          Close
        </Button>
      ))}
      <Button
        variant="tertiary"
        showLabel={false}
        iconStart={<Close />}
        aria-label="Dismiss notification"
      >
        Close
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      {(['primary', 'secondary', 'tertiary'] as const).map((variant) => (
        <Button key={variant} variant={variant} disabled>
          Button label
        </Button>
      ))}
      <Button
        variant="primary"
        disabled
        showLabel={false}
        iconStart={<Close />}
      >
        Close
      </Button>
    </div>
  ),
};

// min-height (not a fixed height) lets a wrapped label grow the button
// under text scaling; explicit line-height keeps the single-line default
// pinned to the exact 48px/32px target.
export const Density: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div data-density="roomy" className="flex items-center gap-3">
        <Button iconStart={<RefreshSync />}>Roomy</Button>
      </div>
      <div data-density="condensed" className="flex items-center gap-3">
        <Button iconStart={<RefreshSync />}>Condensed</Button>
      </div>
    </div>
  ),
};

export const Wrap: Story = {
  render: () => (
    <div className="max-w-40">
      <Button iconStart={<RefreshSync />} className="w-full">
        A label long enough to wrap
      </Button>
    </div>
  ),
};

// Simulates 150% OS/browser text-size scaling (16px/24px -> 24px/36px) by
// overriding the label's font-size/line-height directly (tailwind-merge
// drops the component's own text-[...]/leading-[...] classes in favor of
// these). The component's size tokens are literal px, not rem, so real OS
// text-scaling settings won't actually resize this text today — this is a
// stand-in for what that would look like, to verify min-height still lets
// the button grow rather than clip when it does.
export const ScaledTextWrap: Story = {
  render: () => (
    <div className="max-w-48">
      <Button
        iconStart={<RefreshSync />}
        className="w-full text-[24px] leading-[36px]"
      >
        User Device scaled text
      </Button>
    </div>
  ),
};

// The compound Root/Icon/Label API, for layouts the flat <Button> doesn't
// cover directly (docs/FIGMA_COMPONENT_AUDIT.md's Button "Follow-up").
export const Compound: Story = {
  render: () => (
    <Button.Root variant="secondary" asChild>
      <a href="#directions">
        <Button.Icon>
          <RefreshSync />
        </Button.Icon>
        <Button.Label>Get directions</Button.Label>
      </a>
    </Button.Root>
  ),
};
