import type { Meta, StoryObj } from '@storybook/react-vite';
import { Scrim } from './Scrim';

const meta = {
  title: 'Overlays/Scrim',
  component: Scrim,
  argTypes: {
    className: { control: false, table: { disable: true } },
  },
} satisfies Meta<typeof Scrim>;

export default meta;
type Story = StoryObj<typeof meta>;

// Scrim is always meant to sit beneath something else (e.g. Dialog.Content)
// — this story renders it inside a relatively-positioned box just to make
// the dimmed layer visible in isolation, not as a real usage example.
export const Playground: Story = {
  render: (args) => (
    <div className="relative h-64 w-96 overflow-hidden rounded-[var(--component-dialog-border-radius)] border border-[color:var(--component-dialog-border-color)]">
      <span className="absolute left-2 top-2">
        Page content behind the scrim
      </span>
      <Scrim {...args} className="absolute" />
    </div>
  ),
};
