import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dialog } from './Dialog';
import { Button } from '../Button/Button';

// Root/Trigger/Content/Header/Body/Footer span the compound API, so meta
// isn't bound to a single sub-part's own prop type via `satisfies
// Meta<typeof X>` — same reasoning as Card's own story meta.
interface PlaygroundArgs {
  title: string;
  description: string;
  showHeader: boolean;
  showFooter: boolean;
  showScrim: boolean;
  density: 'roomy' | 'condensed';
}

const meta: Meta<PlaygroundArgs> = {
  title: 'Overlays/Dialog',
  component: Dialog.Content,
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    showHeader: { control: 'boolean' },
    showFooter: { control: 'boolean' },
    showScrim: { control: 'boolean' },
    density: { control: 'radio', options: ['roomy', 'condensed'] },
  },
  args: {
    title: 'Dialog Title',
    description: '',
    showHeader: false,
    showFooter: true,
    showScrim: true,
    density: 'roomy',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: ({
    title,
    description,
    showHeader,
    showFooter,
    showScrim,
    density,
  }) => (
    <Dialog.Root defaultOpen>
      <Dialog.Trigger asChild>
        <Button variant="primary">Open dialog</Button>
      </Dialog.Trigger>
      <Dialog.Content
        title={title}
        description={description || undefined}
        density={density}
        showScrim={showScrim}
        className="w-96"
      >
        {showHeader && <Dialog.Header>Header content goes here.</Dialog.Header>}
        <Dialog.Body>Body content goes here.</Dialog.Body>
        {showFooter && (
          <Dialog.Footer>
            <div className="flex flex-1 justify-end gap-2">
              <Dialog.Close asChild>
                <Button variant="secondary">Cancel</Button>
              </Dialog.Close>
              <Button variant="primary">Confirm</Button>
            </div>
          </Dialog.Footer>
        )}
      </Dialog.Content>
    </Dialog.Root>
  ),
};

export const WithHeaderAndFooter: Story = {
  render: () => (
    <Dialog.Root defaultOpen>
      <Dialog.Trigger asChild>
        <Button variant="primary">Open dialog</Button>
      </Dialog.Trigger>
      <Dialog.Content
        title="Delete account"
        description="This action can't be undone."
        className="w-96"
      >
        <Dialog.Header>Additional context goes here.</Dialog.Header>
        <Dialog.Body>Body content goes here.</Dialog.Body>
        <Dialog.Footer>
          <div className="flex flex-1 justify-end gap-2">
            <Dialog.Close asChild>
              <Button variant="secondary">Cancel</Button>
            </Dialog.Close>
            <Button variant="primary">Delete</Button>
          </div>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  ),
};

// No Header/Footer — just the title and body, exercising the fact that
// both slots are genuinely optional.
export const BodyOnly: Story = {
  render: () => (
    <Dialog.Root defaultOpen>
      <Dialog.Trigger asChild>
        <Button variant="primary">Open dialog</Button>
      </Dialog.Trigger>
      <Dialog.Content title="Dialog Title" className="w-96">
        <Dialog.Body>Body content goes here.</Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  ),
};
