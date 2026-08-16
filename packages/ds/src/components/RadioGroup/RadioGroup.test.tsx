import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RadioGroup } from './RadioGroup';

function BasicRadioGroup(
  props: Partial<React.ComponentProps<typeof RadioGroup.Group>> = {},
) {
  return (
    <RadioGroup.Root defaultValue="a">
      <RadioGroup.Label>Select one option.</RadioGroup.Label>
      <RadioGroup.Group {...props}>
        <RadioGroup.Item value="a">Option A</RadioGroup.Item>
        <RadioGroup.Item value="b">Option B</RadioGroup.Item>
      </RadioGroup.Group>
      <RadioGroup.Microcopy>This is helpful text</RadioGroup.Microcopy>
    </RadioGroup.Root>
  );
}

describe('RadioGroup', () => {
  describe('composition', () => {
    it('renders Root, Label, Items, and Microcopy together', () => {
      render(<BasicRadioGroup />);
      expect(screen.getByText('Select one option.')).toBeInTheDocument();
      expect(screen.getAllByRole('radio')).toHaveLength(2);
      expect(screen.getByText('This is helpful text')).toBeInTheDocument();
    });

    it('checks the defaultValue item and enforces mutual exclusivity', async () => {
      const user = userEvent.setup();
      render(<BasicRadioGroup />);
      const [a, b] = screen.getAllByRole('radio');
      expect(a).toHaveAttribute('data-state', 'checked');

      await user.click(screen.getByText('Option B'));
      expect(a).toHaveAttribute('data-state', 'unchecked');
      expect(b).toHaveAttribute('data-state', 'checked');
    });
  });

  describe('orientation', () => {
    it('defaults to vertical layout', () => {
      render(<BasicRadioGroup />);
      const group = screen.getByRole('radiogroup').querySelector(
        ':scope > div',
      );
      expect(group?.className).toContain('flex-col');
    });

    it('applies horizontal layout when orientation="horizontal"', () => {
      render(<BasicRadioGroup orientation="horizontal" />);
      const group = screen.getByRole('radiogroup').querySelector(
        ':scope > div',
      );
      expect(group?.className).toContain('flex-row');
    });
  });

  describe('error state', () => {
    it('applies the error background/border to the Group and not the Root', () => {
      render(<BasicRadioGroup error />);
      const group = screen.getByText('Option A').closest('label')
        ?.parentElement;
      expect(group?.className).toContain(
        'border-[color:var(--group-field-border-color)]',
      );
    });
  });

  describe('group-level disabling', () => {
    it('disables every item when Root itself is disabled', () => {
      render(
        <RadioGroup.Root defaultValue="a" disabled>
          <RadioGroup.Group>
            <RadioGroup.Item value="a">Option A</RadioGroup.Item>
            <RadioGroup.Item value="b">Option B</RadioGroup.Item>
          </RadioGroup.Group>
        </RadioGroup.Root>,
      );
      const [a, b] = screen.getAllByRole('radio');
      expect(a).toHaveAttribute('data-disabled');
      expect(b).toHaveAttribute('data-disabled');
    });
  });
});
