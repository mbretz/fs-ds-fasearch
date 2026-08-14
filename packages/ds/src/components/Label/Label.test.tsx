import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Label, labelTextVariants } from './Label';
import { cn } from '../../utils/cn';

describe('Label', () => {
  describe('rendering', () => {
    it('renders as a native label element', () => {
      render(<Label data-testid="label">Label</Label>);
      expect(screen.getByTestId('label').tagName).toBe('LABEL');
    });

    it('renders children as the label text', () => {
      render(<Label>Email address</Label>);
      expect(screen.getByText('Email address')).toBeInTheDocument();
    });

    it('associates with a form control via htmlFor', () => {
      render(
        <>
          <Label htmlFor="email">Email</Label>
          <input id="email" data-testid="email-input" />
        </>,
      );
      // getByLabelText resolves the form control associated with a label
      // by matching htmlFor/id (not by finding "Email" text anywhere) — if
      // Label failed to forward htmlFor to the underlying <label>, this
      // query throws instead of returning the input.
      const input = screen.getByLabelText('Email');
      expect(input).toBe(screen.getByTestId('email-input'));
    });
  });

  describe('requirement prop', () => {
    it('renders no asterisk or suffix when omitted', () => {
      render(<Label data-testid="label">Label</Label>);
      const label = screen.getByTestId('label');
      expect(label).toHaveTextContent('Label');
      expect(label).not.toHaveTextContent('*Label');
      expect(label).not.toHaveTextContent('(Optional)');
    });

    it('renders a leading asterisk for requirement="required"', () => {
      render(
        <Label requirement="required" data-testid="label">
          Label
        </Label>,
      );
      expect(screen.getByTestId('label')).toHaveTextContent('*Label');
    });

    it('renders a trailing "(Optional)" suffix for requirement="optional"', () => {
      render(
        <Label requirement="optional" data-testid="label">
          Label
        </Label>,
      );
      expect(screen.getByTestId('label')).toHaveTextContent(
        'Label (Optional)',
      );
    });
  });

  describe('error prop', () => {
    it('does not render the error icon by default', () => {
      render(<Label data-testid="label">Label</Label>);
      expect(
        screen.getByTestId('label').querySelector('svg'),
      ).not.toBeInTheDocument();
    });

    it('renders the error icon when error is true', () => {
      render(
        <Label error data-testid="label">
          Label
        </Label>,
      );
      expect(
        screen.getByTestId('label').querySelector('svg'),
      ).toBeInTheDocument();
    });

    it('applies labelTextVariants({ error: true }) to the text run', () => {
      render(
        <Label error data-testid="label">
          Label
        </Label>,
      );
      const textRun = screen.getByText('Label').closest('span');
      expect(textRun?.className).toBe(cn(labelTextVariants({ error: true })));
    });

    it('applies labelTextVariants({ error: false }) by default', () => {
      render(<Label data-testid="label">Label</Label>);
      const textRun = screen.getByText('Label').closest('span');
      expect(textRun?.className).toBe(
        cn(labelTextVariants({ error: false })),
      );
    });

    it('combines error and required, keeping the asterisk inside the red/bold text run', () => {
      render(
        <Label error requirement="required" data-testid="label">
          Label
        </Label>,
      );
      const label = screen.getByTestId('label');
      expect(label.querySelector('svg')).toBeInTheDocument();
      expect(label).toHaveTextContent('*Label');
      const textRun = screen.getByText('Label').closest('span');
      expect(textRun?.className).toBe(cn(labelTextVariants({ error: true })));
    });
  });

  describe('className merge', () => {
    it('lets a consumer className override the default text size utility', () => {
      render(
        <Label data-testid="label" className="text-2xl">
          Label
        </Label>,
      );
      const classNames = screen.getByTestId('label').className.split(' ');
      expect(classNames).toContain('text-2xl');
      expect(classNames).not.toContain(
        'text-[length:var(--component-label-font-size-default)]',
      );
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref to the underlying label element', () => {
      const ref = createRef<HTMLLabelElement>();
      render(<Label ref={ref}>Label</Label>);
      expect(ref.current).toBeInstanceOf(HTMLLabelElement);
      expect(ref.current?.tagName).toBe('LABEL');
    });
  });
});
