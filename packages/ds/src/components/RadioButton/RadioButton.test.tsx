import { describe, expect, it, vi } from 'vitest';
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RadioButton } from './RadioButton';

function BasicRadioGroup(
  props: Partial<React.ComponentProps<typeof RadioGroupPrimitive.Root>> = {},
) {
  return (
    <RadioGroupPrimitive.Root defaultValue="a" {...props}>
      <RadioButton value="a">Option A</RadioButton>
      <RadioButton value="b">Option B</RadioButton>
      <RadioButton value="c" disabled>
        Option C
      </RadioButton>
    </RadioGroupPrimitive.Root>
  );
}

describe('RadioButton', () => {
  describe('rendering', () => {
    it('renders each item as a radio with its label text', () => {
      render(<BasicRadioGroup />);
      expect(screen.getByText('Option A')).toBeInTheDocument();
      expect(screen.getAllByRole('radio')).toHaveLength(3);
    });
  });

  describe('mutual exclusivity', () => {
    it('checks the defaultValue item and leaves others unchecked', () => {
      render(<BasicRadioGroup />);
      const [a, b] = screen.getAllByRole('radio');
      expect(a).toHaveAttribute('data-state', 'checked');
      expect(b).toHaveAttribute('data-state', 'unchecked');
    });

    it('switches the checked item on click via the whole row', async () => {
      const user = userEvent.setup();
      render(<BasicRadioGroup />);
      await user.click(screen.getByText('Option B'));
      const [a, b] = screen.getAllByRole('radio');
      expect(a).toHaveAttribute('data-state', 'unchecked');
      expect(b).toHaveAttribute('data-state', 'checked');
    });

    it('does not select a disabled item', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<BasicRadioGroup onValueChange={onValueChange} />);
      await user.click(screen.getByText('Option C'));
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe('className merge', () => {
    it('lets a consumer className override the row layout', () => {
      render(
        <RadioGroupPrimitive.Root defaultValue="a">
          <RadioButton value="a" className="gap-4">
            Option A
          </RadioButton>
        </RadioGroupPrimitive.Root>,
      );
      const label = screen.getByText('Option A').closest('label');
      expect(label?.className.split(' ')).toContain('gap-4');
      expect(label?.className).not.toContain('gap-[var(--component-radio-gap)]');
    });
  });
});
