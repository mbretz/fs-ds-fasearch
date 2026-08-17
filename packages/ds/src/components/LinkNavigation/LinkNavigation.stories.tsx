import type { Meta, StoryObj } from '@storybook/react-vite';
import { LinkNavigation } from './LinkNavigation';

const meta = {
  title: 'Primitives/LinkNavigation',
  component: LinkNavigation,
  argTypes: {
    direction: { control: 'select', options: ['previous', 'next'] },
    iconAlign: { control: 'select', options: ['start', 'center', 'end'] },
    className: { control: false, table: { disable: true } },
  },
  args: {
    href: '#',
    direction: 'next',
    children: 'Next',
  },
} satisfies Meta<typeof LinkNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Pair: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <LinkNavigation href="#" direction="previous">
        Prev
      </LinkNavigation>
      <LinkNavigation href="#" direction="next">
        Next
      </LinkNavigation>
    </div>
  ),
};

export const AsButton: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <LinkNavigation asChild direction="previous">
        <button type="button" onClick={() => alert('previous page')}>
          Prev
        </button>
      </LinkNavigation>
      <LinkNavigation asChild direction="next">
        <button type="button" onClick={() => alert('next page')}>
          Next
        </button>
      </LinkNavigation>
    </div>
  ),
};
