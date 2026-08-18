import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs } from './Tabs';

// `density` lives on Tabs.Root, `disabled` on Tabs.Trigger — two controls
// spanning different sub-parts of the compound component, so meta isn't
// bound to a single part's own prop type via `satisfies Meta<typeof X>`.
interface PlaygroundArgs {
  density: 'roomy' | 'condensed';
  disabled: boolean;
}

const meta: Meta<PlaygroundArgs> = {
  title: 'Data display/Tabs',
  component: Tabs.Root,
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

// `density` sets data-density on the whole tablist; `disabled` toggles the
// Notifications trigger — the other two stay fixed reference points so the
// effect is easy to compare against.
export const Playground: Story = {
  render: ({ density, disabled }) => (
    <Tabs.Root defaultValue="account" density={density}>
      <Tabs.List>
        <Tabs.Trigger value="account">Account</Tabs.Trigger>
        <Tabs.Trigger value="security">Security</Tabs.Trigger>
        <Tabs.Trigger value="notifications" disabled={disabled}>
          Notifications
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="account" className="p-4">
        Account panel content
      </Tabs.Content>
      <Tabs.Content value="security" className="p-4">
        Security panel content
      </Tabs.Content>
      <Tabs.Content value="notifications" className="p-4">
        Notifications panel content
      </Tabs.Content>
    </Tabs.Root>
  ),
};

export const Default: Story = {
  render: () => (
    <Tabs.Root defaultValue="account">
      <Tabs.List>
        <Tabs.Trigger value="account">Account</Tabs.Trigger>
        <Tabs.Trigger value="security">Security</Tabs.Trigger>
        <Tabs.Trigger value="notifications">Notifications</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="account" className="p-4">
        Account panel content
      </Tabs.Content>
      <Tabs.Content value="security" className="p-4">
        Security panel content
      </Tabs.Content>
      <Tabs.Content value="notifications" className="p-4">
        Notifications panel content
      </Tabs.Content>
    </Tabs.Root>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Tabs.Root defaultValue="account">
      <Tabs.List>
        <Tabs.Trigger value="account">Account</Tabs.Trigger>
        <Tabs.Trigger value="security">Security</Tabs.Trigger>
        <Tabs.Trigger value="billing" disabled>
          Billing
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="account" className="p-4">
        Account panel content
      </Tabs.Content>
      <Tabs.Content value="security" className="p-4">
        Security panel content
      </Tabs.Content>
      <Tabs.Content value="billing" className="p-4">
        Billing panel content
      </Tabs.Content>
    </Tabs.Root>
  ),
};

export const DensityComparison: Story = {
  name: 'Density comparison',
  render: () => (
    <div className="flex items-start gap-8">
      <div data-density="roomy" className="flex flex-col items-start gap-2">
        <Tabs.Root defaultValue="account">
          <Tabs.List>
            <Tabs.Trigger value="account">Account</Tabs.Trigger>
            <Tabs.Trigger value="security">Security</Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
        <span className="text-xs">roomy</span>
      </div>
      <div data-density="condensed" className="flex flex-col items-start gap-2">
        <Tabs.Root defaultValue="account">
          <Tabs.List>
            <Tabs.Trigger value="account">Account</Tabs.Trigger>
            <Tabs.Trigger value="security">Security</Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
        <span className="text-xs">condensed</span>
      </div>
    </div>
  ),
};
