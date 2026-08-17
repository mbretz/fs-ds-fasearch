import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from './Link';

const meta = {
  title: 'Primitives/Link',
  component: Link,
  argTypes: {
    newWindow: { control: 'boolean' },
    underline: { control: 'boolean' },
    iconVerticalAlign: {
      control: 'select',
      options: ['start', 'center', 'end'],
    },
    className: { control: false, table: { disable: true } },
  },
  args: {
    href: '#',
    newWindow: false,
    underline: true,
    children: 'Link text',
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

// :visited is a real browser-history-driven pseudo-class and can't be
// forced from code (by design, for privacy reasons) — visit
// https://example.com/link-story-target from this browser to see it live.
export const States: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-3">
      <Link href="#">Idle</Link>
      <Link href="https://example.com/link-story-target">
        Visit to see :visited styling
      </Link>
      <Link href="#" underline={false}>
        No underline (structural/block-level link)
      </Link>
    </div>
  ),
};

export const NewWindow: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-3">
      <Link href="#" newWindow>
        Opens in a new window
      </Link>
      <Link href="#" newWindow underline={false}>
        Opens in a new window, no underline
      </Link>
    </div>
  ),
};

// The trailing icon is inline content (vertical-align), not a flex sibling
// — so it wraps with the text naturally and its alignment is relative to
// the last wrapped line, not the whole block.
export const IconVerticalAlignWrap: Story = {
  render: () => (
    <div className="flex gap-8">
      {(['start', 'center', 'end'] as const).map((align) => (
        <div key={align} className="max-w-40">
          <Link href="#" newWindow iconVerticalAlign={align}>
            A link label long enough to wrap onto a second line
          </Link>
        </div>
      ))}
    </div>
  ),
};

export const AsChild: Story = {
  render: () => (
    <Link asChild>
      <button type="button" onClick={() => alert('clicked')}>
        Rendered as a button
      </button>
    </Link>
  ),
};
