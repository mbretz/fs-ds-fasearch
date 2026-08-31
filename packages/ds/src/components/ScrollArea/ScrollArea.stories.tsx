import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScrollArea } from './ScrollArea';
import { Stack } from '../Stack/Stack';

const meta = {
  title: 'Layout/ScrollArea',
  component: ScrollArea,
  argTypes: {
    horizontal: { control: 'boolean' },
    className: { control: false, table: { disable: true } },
  },
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

const rows = Array.from({ length: 30 }, (_, i) => `Row ${i + 1}`);

export const Playground: Story = {
  render: (args) => (
    <ScrollArea
      {...args}
      className="h-64 w-72 rounded-[8px] border border-neutral-border"
    >
      <Stack padding="small" gap="x-small">
        {rows.map((row) => (
          <div
            key={row}
            className="text-[length:var(--semantic-content-common-font-size)]"
          >
            {row}
          </div>
        ))}
      </Stack>
    </ScrollArea>
  ),
};

export const Horizontal: Story = {
  args: { horizontal: true },
  render: (args) => (
    <ScrollArea
      {...args}
      className="h-32 w-72 rounded-[8px] border border-neutral-border"
    >
      <Stack direction="row" padding="small" gap="x-small" className="w-max">
        {rows.map((row) => (
          <div
            key={row}
            className="flex h-full w-24 shrink-0 items-center justify-center bg-neutral-subtle"
          >
            {row}
          </div>
        ))}
      </Stack>
    </ScrollArea>
  ),
};

export const CompoundParts: Story = {
  render: () => (
    <ScrollArea.Root className="h-64 w-72 overflow-hidden rounded-[8px] border border-neutral-border">
      <ScrollArea.Viewport className="size-full">
        <Stack padding="small" gap="x-small">
          {rows.map((row) => (
            <div key={row}>{row}</div>
          ))}
        </Stack>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner />
    </ScrollArea.Root>
  ),
};
