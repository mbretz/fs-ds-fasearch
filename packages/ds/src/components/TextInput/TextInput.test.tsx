import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextInput, textInputFieldVariants } from './TextInput';
import { cn } from '../../utils/cn';

describe('TextInput', () => {
  describe('composition', () => {
    it('renders Root, Label, Field, and Microcopy together', () => {
      render(
        <TextInput.Root>
          <TextInput.Label htmlFor="email">Email</TextInput.Label>
          <TextInput.Field id="email" defaultValue="me@example.com" />
          <TextInput.Microcopy>We never share this.</TextInput.Microcopy>
        </TextInput.Root>,
      );
      expect(screen.getByLabelText('Email')).toHaveValue('me@example.com');
      expect(screen.getByText('We never share this.')).toBeInTheDocument();
    });
  });

  describe('Field state', () => {
    it('applies textInputFieldVariants({ state: "default" }) by default', () => {
      render(<TextInput.Field data-testid="field" />);
      const wrapper = screen.getByTestId('field').parentElement;
      expect(wrapper?.className).toBe(
        cn(textInputFieldVariants({ state: 'default' })),
      );
    });

    it('applies the error state', () => {
      render(<TextInput.Field data-testid="field" error />);
      const wrapper = screen.getByTestId('field').parentElement;
      expect(wrapper?.className).toBe(
        cn(textInputFieldVariants({ state: 'error' })),
      );
    });

    it('applies the disabled state and disables the input', () => {
      render(<TextInput.Field data-testid="field" disabled />);
      const input = screen.getByTestId('field');
      expect(input).toBeDisabled();
      expect(input.parentElement?.className).toBe(
        cn(textInputFieldVariants({ state: 'disabled' })),
      );
    });

    it('applies the read-only state and marks the input read-only', () => {
      render(<TextInput.Field data-testid="field" readOnly />);
      const input = screen.getByTestId('field');
      expect(input).toHaveAttribute('readonly');
      expect(input.parentElement?.className).toBe(
        cn(textInputFieldVariants({ state: 'read-only' })),
      );
    });

    it('prioritizes disabled over error when both are set', () => {
      render(<TextInput.Field data-testid="field" disabled error />);
      const wrapper = screen.getByTestId('field').parentElement;
      expect(wrapper?.className).toBe(
        cn(textInputFieldVariants({ state: 'disabled' })),
      );
    });
  });

  describe('icon slots', () => {
    it('renders iconStart as the input\'s immediately preceding sibling', () => {
      render(
        <TextInput.Field
          data-testid="field"
          iconStart={<svg data-testid="icon-start" />}
        />,
      );
      const input = screen.getByTestId('field');
      const icon = screen.getByTestId('icon-start');
      expect(input.previousElementSibling).toBe(icon.parentElement);
    });

    it('renders iconEnd as the input\'s immediately following sibling', () => {
      render(
        <TextInput.Field
          data-testid="field"
          iconEnd={<svg data-testid="icon-end" />}
        />,
      );
      const input = screen.getByTestId('field');
      const icon = screen.getByTestId('icon-end');
      expect(input.nextElementSibling).toBe(icon.parentElement);
    });

    it('renders no icon wrapper when neither slot is provided', () => {
      render(<TextInput.Field data-testid="field" />);
      const wrapper = screen.getByTestId('field').parentElement;
      expect(wrapper?.querySelector('span[aria-hidden]')).toBeNull();
    });
  });

  describe('focus', () => {
    it('forwards ref to the underlying input so .focus() works programmatically', async () => {
      const ref = createRef<HTMLInputElement>();
      render(<TextInput.Field ref={ref} data-testid="field" />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      ref.current?.focus();
      expect(screen.getByTestId('field')).toHaveFocus();
    });

    it('is reachable via keyboard Tab', async () => {
      const user = userEvent.setup();
      render(
        <>
          <button type="button">before</button>
          <TextInput.Field data-testid="field" />
        </>,
      );
      await user.tab();
      await user.tab();
      expect(screen.getByTestId('field')).toHaveFocus();
    });
  });

  describe('className merge', () => {
    it('lets a consumer className override the default rounded utility', () => {
      render(
        <TextInput.Field data-testid="field" className="rounded-none" />,
      );
      const wrapper = screen.getByTestId('field').parentElement;
      const classNames = wrapper?.className.split(' ') ?? [];
      expect(classNames).toContain('rounded-none');
      expect(classNames).not.toContain(
        'rounded-[var(--component-text-input-border-radius)]',
      );
    });
  });

  describe('ref forwarding', () => {
    it('Root forwards ref to the underlying div', () => {
      const ref = createRef<HTMLDivElement>();
      render(<TextInput.Root ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('Microcopy forwards ref to the underlying p', () => {
      const ref = createRef<HTMLParagraphElement>();
      render(<TextInput.Microcopy ref={ref}>Helper text</TextInput.Microcopy>);
      expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
    });
  });
});
