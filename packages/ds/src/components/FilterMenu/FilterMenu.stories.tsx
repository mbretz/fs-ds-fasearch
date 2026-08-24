import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FilterMenu } from './FilterMenu';
import { Button } from '../Button/Button';
import { Checkbox } from '../Checkbox/Checkbox';

// Checkbox's own visual state is driven entirely by its `checked` prop, not
// by Radix's internal uncontrolled state, so every story usage needs real
// controlled state — same pattern as Checkbox.stories.tsx's own Playground.
function AccountFilters({ initial }: { initial: [boolean, boolean] }) {
  const [checking, setChecking] = useState(initial[0]);
  const [savings, setSavings] = useState(initial[1]);
  return (
    <>
      <Checkbox
        checked={checking}
        onCheckedChange={(v) => setChecking(v === true)}
      >
        Checking account
      </Checkbox>
      <Checkbox
        checked={savings}
        onCheckedChange={(v) => setSavings(v === true)}
      >
        Savings account
      </Checkbox>
    </>
  );
}

// Root/Header/Trigger/ClearButton/Content/Drawer/Footer span the compound
// API, so meta isn't bound to a single sub-part's own prop type via
// `satisfies Meta<typeof X>` — same reasoning as Dialog's own story meta.
interface PlaygroundArgs {
  showClearButton: boolean;
  clearCount: number;
  density: 'roomy' | 'condensed';
}

const meta: Meta<PlaygroundArgs> = {
  title: 'Overlays/FilterMenu',
  component: FilterMenu.Content,
  argTypes: {
    showClearButton: { control: 'boolean' },
    clearCount: { control: 'number' },
    density: { control: 'radio', options: ['roomy', 'condensed'] },
  },
  args: {
    showClearButton: true,
    clearCount: 2,
    density: 'roomy',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: ({ showClearButton, clearCount, density }) => (
    <FilterMenu.Root defaultOpen density={density}>
      <FilterMenu.Header>
        <FilterMenu.Trigger>Show Filters</FilterMenu.Trigger>
        {showClearButton && (
          <FilterMenu.ClearButton count={clearCount}>
            Clear
          </FilterMenu.ClearButton>
        )}
      </FilterMenu.Header>
      <FilterMenu.Content>
        <FilterMenu.Drawer>
          <AccountFilters initial={[true, false]} />
        </FilterMenu.Drawer>
        <FilterMenu.Footer>
          <Button variant="secondary">Apply Filters</Button>
        </FilterMenu.Footer>
      </FilterMenu.Content>
    </FilterMenu.Root>
  ),
};

// Closed by default, exercising the real Trigger-driven open flow instead
// of defaultOpen.
export const ClosedByDefault: Story = {
  render: () => (
    <FilterMenu.Root>
      <FilterMenu.Header>
        <FilterMenu.Trigger>Show Filters</FilterMenu.Trigger>
        <FilterMenu.ClearButton count={2}>Clear</FilterMenu.ClearButton>
      </FilterMenu.Header>
      <FilterMenu.Content>
        <FilterMenu.Drawer>
          <AccountFilters initial={[true, false]} />
        </FilterMenu.Drawer>
        <FilterMenu.Footer>
          <Button variant="secondary">Apply Filters</Button>
        </FilterMenu.Footer>
      </FilterMenu.Content>
    </FilterMenu.Root>
  ),
};

// No ClearButton and no count — exercises both being genuinely optional.
export const NoActiveFilters: Story = {
  render: () => (
    <FilterMenu.Root defaultOpen>
      <FilterMenu.Header>
        <FilterMenu.Trigger>Show Filters</FilterMenu.Trigger>
      </FilterMenu.Header>
      <FilterMenu.Content>
        <FilterMenu.Drawer>
          <AccountFilters initial={[false, false]} />
        </FilterMenu.Drawer>
        <FilterMenu.Footer>
          <Button variant="secondary">Apply Filters</Button>
        </FilterMenu.Footer>
      </FilterMenu.Content>
    </FilterMenu.Root>
  ),
};
