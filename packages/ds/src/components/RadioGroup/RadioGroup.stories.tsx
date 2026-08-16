import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioGroup } from './RadioGroup';

const meta = {
  title: 'Primitives/RadioGroup',
  component: RadioGroup.Group,
  argTypes: {
    error: { control: 'boolean' },
    orientation: {
      control: 'radio',
      options: ['vertical', 'horizontal'],
    },
    className: { control: false, table: { disable: true } },
  },
  args: {
    error: false,
    orientation: 'vertical',
  },
} satisfies Meta<typeof RadioGroup.Group>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <RadioGroup.Root defaultValue="a" className="w-72">
      <RadioGroup.Label error={args.error} requirement="required">
        Select one option.
      </RadioGroup.Label>
      <RadioGroup.Group {...args}>
        <RadioGroup.Item value="a">Value</RadioGroup.Item>
        <RadioGroup.Item value="b">Value</RadioGroup.Item>
      </RadioGroup.Group>
      <RadioGroup.Microcopy error={args.error}>
        This is helpful text
      </RadioGroup.Microcopy>
    </RadioGroup.Root>
  ),
};

export const Default: Story = {
  render: () => (
    <RadioGroup.Root defaultValue="a" className="w-72">
      <RadioGroup.Label requirement="required">
        Select one option.
      </RadioGroup.Label>
      <RadioGroup.Group>
        <RadioGroup.Item value="a">Value</RadioGroup.Item>
        <RadioGroup.Item value="b">Value</RadioGroup.Item>
      </RadioGroup.Group>
      <RadioGroup.Microcopy>This is helpful text</RadioGroup.Microcopy>
    </RadioGroup.Root>
  ),
};

export const ErrorState: Story = {
  render: () => (
    <RadioGroup.Root defaultValue="a" className="w-72">
      <RadioGroup.Label error requirement="required">
        Select one option.
      </RadioGroup.Label>
      <RadioGroup.Group error>
        <RadioGroup.Item value="a">Value</RadioGroup.Item>
        <RadioGroup.Item value="b">Value</RadioGroup.Item>
      </RadioGroup.Group>
      <RadioGroup.Microcopy error>This is helpful text</RadioGroup.Microcopy>
    </RadioGroup.Root>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <RadioGroup.Root defaultValue="a">
      <RadioGroup.Label requirement="required">
        Select one option.
      </RadioGroup.Label>
      <RadioGroup.Group orientation="horizontal">
        <RadioGroup.Item value="a">Value</RadioGroup.Item>
        <RadioGroup.Item value="b">Value</RadioGroup.Item>
        <RadioGroup.Item value="c">Value</RadioGroup.Item>
      </RadioGroup.Group>
      <RadioGroup.Microcopy>This is helpful text</RadioGroup.Microcopy>
    </RadioGroup.Root>
  ),
};

export const GroupDisabled: Story = {
  render: () => (
    <RadioGroup.Root defaultValue="a" disabled className="w-72">
      <RadioGroup.Label requirement="required">
        Select one option.
      </RadioGroup.Label>
      <RadioGroup.Group>
        <RadioGroup.Item value="a">Value</RadioGroup.Item>
        <RadioGroup.Item value="b">Value</RadioGroup.Item>
      </RadioGroup.Group>
      <RadioGroup.Microcopy>This is helpful text</RadioGroup.Microcopy>
    </RadioGroup.Root>
  ),
};
