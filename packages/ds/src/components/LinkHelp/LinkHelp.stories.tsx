import type { Meta, StoryObj } from '@storybook/react-vite';
import { LinkHelp } from './LinkHelp';

const meta = {
  title: 'Primitives/LinkHelp',
  component: LinkHelp,
  argTypes: {
    className: { control: false, table: { disable: true } },
  },
  args: {
    href: '#',
    children: 'How do I phrase the user’s question?',
  },
} satisfies Meta<typeof LinkHelp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

// The icon stays pinned to the top of the row, centered against line 1
// specifically — later wrapped lines extend downward without pulling it
// away from the top (see LinkHelp.tsx).
export const Wrap: Story = {
  render: () => (
    <div className="max-w-40">
      <LinkHelp href="#">
        A help link label long enough to wrap onto a second line
      </LinkHelp>
    </div>
  ),
};
