import type { Meta, StoryObj } from '@storybook/react-vite';
import { CloseButton } from './CloseButton';

const meta = {
  title: 'Primitives/CloseButton',
  component: CloseButton,
  argTypes: {
    className: { control: false, table: { disable: true } },
    'aria-label': {
      control: 'text',
      description:
        'Overrides the default "Close" accessible name. Set this when there are multiple dismissible things on one page (e.g. "Dismiss notification") so screen-reader users can tell them apart.',
    },
  },
} satisfies Meta<typeof CloseButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

// The case the aria-label override exists for: several dismissible
// things on one screen, where "Close" alone wouldn't tell them apart.
export const WithAriaLabel: Story = {
  args: {
    'aria-label': 'Dismiss notification',
  },
};
