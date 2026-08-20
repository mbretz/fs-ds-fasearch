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
    density: { control: 'radio', options: ['roomy', 'condensed'] },
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

export const Density: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div data-density="roomy" className="flex items-center gap-3">
        <CloseButton />
        <span className="text-xs">roomy</span>
      </div>
      <div data-density="condensed" className="flex items-center gap-3">
        <CloseButton />
        <span className="text-xs">condensed</span>
      </div>
    </div>
  ),
};
