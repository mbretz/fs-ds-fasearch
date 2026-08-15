import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextArea, textAreaFieldVariants } from './TextArea';
import { cn } from '../../utils/cn';

describe('TextArea', () => {
  describe('composition', () => {
    it('renders Root, Label, Field, and Microcopy together', () => {
      render(
        <TextArea.Root>
          <TextArea.Label htmlFor="bio">Bio</TextArea.Label>
          <TextArea.Field id="bio" defaultValue="Hello world" />
          <TextArea.Microcopy>Max 500 characters.</TextArea.Microcopy>
        </TextArea.Root>,
      );
      expect(screen.getByLabelText('Bio')).toHaveValue('Hello world');
      expect(screen.getByText('Max 500 characters.')).toBeInTheDocument();
    });

    it('renders the Field as a textarea element', () => {
      render(<TextArea.Field data-testid="field" />);
      expect(screen.getByTestId('field').tagName).toBe('TEXTAREA');
    });
  });

  describe('Field state', () => {
    it('applies textAreaFieldVariants({ state: "default" }) by default', () => {
      render(<TextArea.Field data-testid="field" />);
      const wrapper = screen.getByTestId('field').parentElement;
      expect(wrapper?.className).toBe(
        cn(textAreaFieldVariants({ state: 'default' })),
      );
    });

    it('applies the error state', () => {
      render(<TextArea.Field data-testid="field" error />);
      const wrapper = screen.getByTestId('field').parentElement;
      expect(wrapper?.className).toBe(
        cn(textAreaFieldVariants({ state: 'error' })),
      );
    });

    it('applies the disabled state and disables the textarea', () => {
      render(<TextArea.Field data-testid="field" disabled />);
      const field = screen.getByTestId('field');
      expect(field).toBeDisabled();
      expect(field.parentElement?.className).toBe(
        cn(textAreaFieldVariants({ state: 'disabled' })),
      );
    });

    it('applies the read-only state and marks the textarea read-only', () => {
      render(<TextArea.Field data-testid="field" readOnly />);
      const field = screen.getByTestId('field');
      expect(field).toHaveAttribute('readonly');
      expect(field.parentElement?.className).toBe(
        cn(textAreaFieldVariants({ state: 'read-only' })),
      );
    });

    it('collapses inline-start padding on both wrapper and textarea when read-only', () => {
      render(<TextArea.Field data-testid="field" readOnly />);
      const field = screen.getByTestId('field');
      const wrapperClasses = field.parentElement?.className.split(' ') ?? [];
      const fieldClasses = field.className.split(' ');
      expect(wrapperClasses).toContain('pl-0');
      expect(fieldClasses).toContain('pl-0');
      expect(fieldClasses).not.toContain(
        'pl-[var(--component-text-area-input-value-padding-inline)]',
      );
    });

    it('prioritizes disabled over error when both are set', () => {
      render(<TextArea.Field data-testid="field" disabled error />);
      const wrapper = screen.getByTestId('field').parentElement;
      expect(wrapper?.className).toBe(
        cn(textAreaFieldVariants({ state: 'disabled' })),
      );
    });
  });

  describe('focus', () => {
    it('forwards ref to the underlying textarea so .focus() works programmatically', () => {
      const ref = createRef<HTMLTextAreaElement>();
      render(<TextArea.Field ref={ref} data-testid="field" />);
      expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
      ref.current?.focus();
      expect(screen.getByTestId('field')).toHaveFocus();
    });

    it('is reachable via keyboard Tab', async () => {
      const user = userEvent.setup();
      render(
        <>
          <button type="button">before</button>
          <TextArea.Field data-testid="field" />
        </>,
      );
      await user.tab();
      await user.tab();
      expect(screen.getByTestId('field')).toHaveFocus();
    });
  });

  describe('className merge', () => {
    it('lets a consumer className override the default rounded utility', () => {
      render(<TextArea.Field data-testid="field" className="rounded-none" />);
      const wrapper = screen.getByTestId('field').parentElement;
      const classNames = wrapper?.className.split(' ') ?? [];
      expect(classNames).toContain('rounded-none');
      expect(classNames).not.toContain(
        'rounded-[var(--component-text-area-border-radius)]',
      );
    });
  });

  describe('ref forwarding', () => {
    it('Root forwards ref to the underlying div', () => {
      const ref = createRef<HTMLDivElement>();
      render(<TextArea.Root ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('Microcopy forwards ref to the underlying p', () => {
      const ref = createRef<HTMLParagraphElement>();
      render(<TextArea.Microcopy ref={ref}>Helper text</TextArea.Microcopy>);
      expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
    });
  });
});
