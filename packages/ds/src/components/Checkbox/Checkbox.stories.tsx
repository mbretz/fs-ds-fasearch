import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Primitives/Checkbox',
  component: Checkbox,
  argTypes: {
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    className: { control: false, table: { disable: true } },
  },
  args: {
    error: false,
    disabled: false,
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => {
    const [checked, setChecked] = useState<boolean | 'indeterminate'>(false);
    return (
      <Checkbox {...args} checked={checked} onCheckedChange={setChecked}>
        Value
      </Checkbox>
    );
  },
};

// No checked/onCheckedChange — Radix manages its own internal state via
// defaultChecked, exercising the uncontrolled path directly (the scenario
// that exposed the data-state styling bug fixed 2026-08-24).
export const Uncontrolled: Story = {
  render: (args) => (
    <Checkbox {...args} defaultChecked>
      Value
    </Checkbox>
  ),
};

// defaultChecked="indeterminate" — the "select all" pattern, uncontrolled.
// A real app would wire this up to a group of child checkboxes; this story
// isolates just the uncontrolled parent to verify Radix's own internal
// state cycle (indeterminate -> checked -> unchecked on repeated clicks) is
// reflected correctly by CSS, not just the initial indeterminate render.
export const UncontrolledIndeterminate: Story = {
  render: (args) => (
    <Checkbox {...args} defaultChecked="indeterminate">
      Select all
    </Checkbox>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-1">
      <Checkbox checked={false}>Unchecked</Checkbox>
      <Checkbox checked>Checked</Checkbox>
      <Checkbox checked="indeterminate">Indeterminate</Checkbox>
      <Checkbox error checked={false}>
        Error
      </Checkbox>
      <Checkbox disabled>Disabled, unchecked</Checkbox>
      <Checkbox disabled checked>
        Disabled, checked
      </Checkbox>
      <Checkbox disabled checked="indeterminate">
        Disabled, indeterminate
      </Checkbox>
    </div>
  ),
};
