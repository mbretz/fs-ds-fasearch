import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SelectInput, selectInputTriggerVariants } from './SelectInput';
import { cn } from '../../utils/cn';

function BasicSelect(
  props: Partial<React.ComponentProps<typeof SelectInput.Trigger>> = {},
) {
  return (
    <SelectInput.Root>
      <SelectInput.Label htmlFor="fruit">Fruit</SelectInput.Label>
      <SelectInput.Trigger id="fruit" placeholder="Select a fruit" {...props} />
      <SelectInput.Content>
        <SelectInput.Option value="apple">Apple</SelectInput.Option>
        <SelectInput.Option value="banana">Banana</SelectInput.Option>
      </SelectInput.Content>
      <SelectInput.Microcopy>We only stock fresh fruit.</SelectInput.Microcopy>
    </SelectInput.Root>
  );
}

describe('SelectInput', () => {
  describe('composition', () => {
    it('renders Root, Label, Trigger, and Microcopy together', () => {
      render(<BasicSelect />);
      expect(screen.getByText('Fruit')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(
        screen.getByText('We only stock fresh fruit.'),
      ).toBeInTheDocument();
    });

    it('shows the placeholder when no value is selected', () => {
      render(<BasicSelect />);
      expect(screen.getByText('Select a fruit')).toBeInTheDocument();
    });
  });

  describe('opening and selecting', () => {
    it('opens the option list and selects an option on click', async () => {
      const user = userEvent.setup();
      render(<BasicSelect />);
      await user.click(screen.getByRole('combobox'));
      const option = await screen.findByRole('option', { name: 'Apple' });
      await user.click(option);
      expect(screen.getByRole('combobox')).toHaveTextContent('Apple');
    });
  });

  describe('Trigger state', () => {
    it('applies selectInputTriggerVariants({ state: "default" }) by default', () => {
      render(<BasicSelect />);
      expect(screen.getByRole('combobox').className).toBe(
        cn(selectInputTriggerVariants({ state: 'default' })),
      );
    });

    it('applies the error state', () => {
      render(<BasicSelect error />);
      expect(screen.getByRole('combobox').className).toBe(
        cn(selectInputTriggerVariants({ state: 'error' })),
      );
    });

    it('applies the disabled state and disables the trigger', () => {
      render(<BasicSelect disabled />);
      const trigger = screen.getByRole('combobox');
      expect(trigger).toBeDisabled();
      expect(trigger.className).toBe(
        cn(selectInputTriggerVariants({ state: 'disabled' })),
      );
    });

    it('applies the read-only state without disabling the trigger', () => {
      render(<BasicSelect readOnly />);
      const trigger = screen.getByRole('combobox');
      expect(trigger).not.toBeDisabled();
      expect(trigger.className).toBe(
        cn(selectInputTriggerVariants({ state: 'read-only' })),
      );
    });

    it('prioritizes disabled over error when both are set', () => {
      render(<BasicSelect disabled error />);
      expect(screen.getByRole('combobox').className).toBe(
        cn(selectInputTriggerVariants({ state: 'disabled' })),
      );
    });
  });

  describe('className merge', () => {
    it('lets a consumer className override the default rounded utility', () => {
      render(<BasicSelect className="rounded-none" />);
      const classNames = screen.getByRole('combobox').className.split(' ');
      expect(classNames).toContain('rounded-none');
      expect(classNames).not.toContain(
        'rounded-[var(--component-select-input-border-radius)]',
      );
    });
  });
});
