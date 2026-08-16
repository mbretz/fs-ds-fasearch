import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioButton } from './RadioButton';
import { RadioGroup } from '../RadioGroup/RadioGroup';

const meta = {
  title: 'Primitives/RadioButton',
  component: RadioButton,
  argTypes: {
    disabled: { control: 'boolean' },
    value: { control: false, table: { disable: true } },
    className: { control: false, table: { disable: true } },
  },
  args: {
    disabled: false,
    value: 'value',
  },
} satisfies Meta<typeof RadioButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <RadioGroup.Root defaultValue={args.value}>
      <RadioButton {...args}>Value</RadioButton>
    </RadioGroup.Root>
  ),
};

export const States: Story = {
  // Three separate Roots: radios are mutually exclusive within a group, so
  // "Disabled, checked" needs its own Root to be checked independently of
  // "Checked" above it. The third Root demonstrates group-level disabling
  // (RadioGroup.Root's own `disabled`, no per-item `disabled` prop) — the
  // real-world case this component's peer-/has-[]-driven label and cursor
  // styling exists for, since a consumer disabling a whole group wouldn't
  // repeat `disabled` on every item.
  render: () => (
    <div className="flex flex-col items-start gap-1">
      <RadioGroup.Root defaultValue="checked" className="gap-1">
        <RadioButton value="unchecked">Unchecked</RadioButton>
        <RadioButton value="checked">Checked</RadioButton>
        <RadioButton value="disabled-unchecked" disabled>
          Disabled, unchecked
        </RadioButton>
      </RadioGroup.Root>
      <RadioGroup.Root defaultValue="disabled-checked">
        <RadioButton value="disabled-checked" disabled>
          Disabled, checked
        </RadioButton>
      </RadioGroup.Root>
      <RadioGroup.Root
        defaultValue="group-disabled-checked"
        disabled
        className="gap-1"
      >
        <RadioButton value="group-disabled-checked">
          Group-disabled, checked
        </RadioButton>
        <RadioButton value="group-disabled-unchecked">
          Group-disabled, unchecked
        </RadioButton>
      </RadioGroup.Root>
    </div>
  ),
};
