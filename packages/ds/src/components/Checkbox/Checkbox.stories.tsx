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

export const States: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-1">
      <Checkbox checked={false}>Unchecked</Checkbox>
      <Checkbox checked>Checked</Checkbox>
      <Checkbox checked="indeterminate">Indeterminate</Checkbox>
      <Checkbox error>Error</Checkbox>
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
