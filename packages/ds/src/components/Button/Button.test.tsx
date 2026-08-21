import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button, buttonRootVariants } from './Button';

describe('Button', () => {
  describe('rendering', () => {
    it('renders as a button with the label as its accessible name', () => {
      render(<Button>Save</Button>);
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    });

    it('places a start icon before the label and an end icon after it', () => {
      render(
        <Button
          iconStart={<svg data-testid="icon-start" />}
          iconEnd={<svg data-testid="icon-end" />}
        >
          Save
        </Button>,
      );
      const button = screen.getByRole('button');
      const [start, label, end] = Array.from(button.children);
      expect(start).toContainElement(screen.getByTestId('icon-start'));
      expect(label).toHaveTextContent('Save');
      expect(end).toContainElement(screen.getByTestId('icon-end'));
    });
  });

  describe('icon-only accessibility', () => {
    it('visually hides the label but keeps it as the default accessible name', () => {
      render(<Button showLabel={false}>Close</Button>);
      const button = screen.getByRole('button', { name: 'Close' });
      expect(screen.getByText('Close')).toHaveClass('sr-only');
      expect(button).not.toHaveAttribute('aria-label');
    });

    it('lets aria-label override the accessible name', () => {
      render(
        <Button showLabel={false} aria-label="Dismiss notification">
          Close
        </Button>,
      );
      expect(
        screen.getByRole('button', { name: 'Dismiss notification' }),
      ).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
    });
  });

  describe('height', () => {
    it('lets a long label wrap and grow the button, rather than being clipped at a fixed height', () => {
      render(<Button>Save</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain(
        'min-h-[var(--component-button-min-height)]',
      );
      expect(button.className).not.toMatch(
        /(?<!min-)h-\[var\(--component-button/,
      );
      expect(screen.getByText('Save').className).not.toContain(
        'whitespace-nowrap',
      );
    });

    it('renders at the exact target height for a single-line label', () => {
      render(<Button>Save</Button>);
      const className = screen.getByRole('button').className;
      expect(className).toContain(
        'leading-[length:var(--component-button-line-height)]',
      );
      // Border sits inside the border-box, but a min-height budget of
      // padding + line-height already sums to the target with no room left
      // for it — padding-block subtracts the border width to compensate.
      expect(className).toContain(
        'py-[calc(var(--component-button-padding-block)-var(--component-button-border-width))]',
      );
    });
  });

  describe('icon-only square sizing', () => {
    it('gives a labeled button a min-width floor plus real padding on both axes', () => {
      render(<Button>Save</Button>);
      const className = screen.getByRole('button').className;
      expect(className).toContain('min-w-[var(--component-button-min-width)]');
      expect(className).toContain(
        'px-[var(--component-button-padding-inline)]',
      );
      expect(className).toContain(
        'py-[calc(var(--component-button-padding-block)-var(--component-button-border-width))]',
      );
      expect(className).not.toContain('w-[var(--component-button-min-height)]');
      expect(className).not.toContain('py-0');
    });

    it('forces an exact min-height square (both width and height) with zero padding when showLabel is false', () => {
      render(<Button showLabel={false}>Close</Button>);
      const className = screen.getByRole('button').className;
      expect(className).toContain('w-[var(--component-button-min-height)]');
      expect(className).toContain('h-[var(--component-button-min-height)]');
      expect(className).toContain('px-0');
      expect(className).toContain('py-0');
      expect(className).not.toContain(
        'min-w-[var(--component-button-min-width)]',
      );
    });

    it('exposes iconOnly directly on Button.Root, for a compound icon-only button with no label at all', () => {
      render(
        <Button.Root iconOnly aria-label="Export">
          <Button.Icon>
            <svg data-testid="icon" />
          </Button.Icon>
        </Button.Root>,
      );
      const className = screen.getByRole('button', {
        name: 'Export',
      }).className;
      expect(className).toContain('w-[var(--component-button-min-height)]');
      expect(className).toContain('h-[var(--component-button-min-height)]');
    });

    it('produces distinct cva output for iconOnly true vs false', () => {
      expect(buttonRootVariants({ iconOnly: true })).not.toBe(
        buttonRootVariants({ iconOnly: false }),
      );
    });
  });

  describe('disabled', () => {
    it('is a native disabled button', () => {
      render(<Button disabled>Save</Button>);
      expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    });
  });

  describe('asChild', () => {
    it('renders the compound Root as the child element instead of a button', () => {
      render(
        <Button.Root asChild>
          <a href="/export">
            <Button.Icon>
              <svg data-testid="icon" />
            </Button.Icon>
            <Button.Label>Export</Button.Label>
          </a>
        </Button.Root>,
      );
      const link = screen.getByRole('link', { name: 'Export' });
      expect(link).toHaveAttribute('href', '/export');
      expect(screen.queryByRole('button')).toBeNull();
    });
  });

  describe('variants', () => {
    it('applies the destructive compound variant for each variant', () => {
      for (const variant of ['primary', 'secondary', 'tertiary'] as const) {
        const withDestructive = buttonRootVariants({
          variant,
          destructive: true,
        });
        const without = buttonRootVariants({ variant, destructive: false });
        expect(withDestructive).not.toBe(without);
      }
    });
  });

  describe('className merge', () => {
    it('lets a consumer className override the default gap', () => {
      render(<Button className="gap-4">Save</Button>);
      const button = screen.getByRole('button');
      expect(button.className.split(' ')).toContain('gap-4');
      expect(button.className).not.toContain(
        'gap-[var(--component-button-gap)]',
      );
    });
  });
});
