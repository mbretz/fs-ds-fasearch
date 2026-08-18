import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Checkbox,
  checkboxInputVariants,
  checkboxLabelVariants,
} from './Checkbox';
import { cn } from '../../utils/cn';

describe('Checkbox', () => {
  describe('rendering', () => {
    it('renders the label text and an unchecked checkbox role', () => {
      render(<Checkbox>Subscribe</Checkbox>);
      expect(screen.getByText('Subscribe')).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('renders with no label text when children are omitted', () => {
      render(<Checkbox aria-label="Subscribe" />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });
  });

  describe('toggling', () => {
    it('toggles on click via the whole row (native label behavior)', async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();
      render(<Checkbox onCheckedChange={onCheckedChange}>Subscribe</Checkbox>);
      await user.click(screen.getByText('Subscribe'));
      expect(onCheckedChange).toHaveBeenCalledWith(true);
    });

    it('supports a controlled indeterminate state', () => {
      render(<Checkbox checked="indeterminate">Select all</Checkbox>);
      expect(screen.getByRole('checkbox')).toHaveAttribute(
        'data-state',
        'indeterminate',
      );
    });

    it('does not toggle when disabled', async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();
      render(
        <Checkbox disabled onCheckedChange={onCheckedChange}>
          Subscribe
        </Checkbox>,
      );
      await user.click(screen.getByText('Subscribe'));
      expect(onCheckedChange).not.toHaveBeenCalled();
    });
  });

  describe('state variants', () => {
    function ControlledCheckbox(
      props: Partial<React.ComponentProps<typeof Checkbox>> = {},
    ) {
      const [checked, setChecked] = useState<boolean | 'indeterminate'>(false);
      return (
        <Checkbox checked={checked} onCheckedChange={setChecked} {...props}>
          Subscribe
        </Checkbox>
      );
    }

    it('applies checkboxInputVariants({ state: "unchecked" }) by default', () => {
      render(<ControlledCheckbox />);
      expect(screen.getByRole('checkbox').className).toBe(
        cn(checkboxInputVariants({ state: 'unchecked' })),
      );
    });

    it('applies checkboxInputVariants({ state: "checked" }) when checked', () => {
      render(<ControlledCheckbox checked />);
      expect(screen.getByRole('checkbox').className).toBe(
        cn(checkboxInputVariants({ state: 'checked' })),
      );
    });

    it('applies checkboxInputVariants({ state: "disabled" }) when disabled, even if checked', () => {
      render(<ControlledCheckbox checked disabled />);
      expect(screen.getByRole('checkbox').className).toBe(
        cn(checkboxInputVariants({ state: 'disabled' })),
      );
    });

    it('applies the disabled box style while still rendering the indeterminate glyph', () => {
      render(
        <Checkbox disabled checked="indeterminate">
          Select all
        </Checkbox>,
      );
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox.className).toBe(
        cn(checkboxInputVariants({ state: 'disabled' })),
      );
      expect(checkbox).toHaveAttribute('data-state', 'indeterminate');
      expect(
        screen.getByTestId('checkbox-indeterminate-glyph'),
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('checkbox-check-glyph'),
      ).not.toBeInTheDocument();
    });

    it('applies the error label color without changing the box', () => {
      render(<Checkbox error>Subscribe</Checkbox>);
      expect(screen.getByText('Subscribe').className).toBe(
        cn(checkboxLabelVariants({ state: 'error' })),
      );
      expect(screen.getByRole('checkbox').className).toBe(
        cn(checkboxInputVariants({ state: 'unchecked' })),
      );
    });

    it('prioritizes the disabled label color over error', () => {
      render(
        <Checkbox error disabled>
          Subscribe
        </Checkbox>,
      );
      expect(screen.getByText('Subscribe').className).toBe(
        cn(checkboxLabelVariants({ state: 'disabled' })),
      );
    });
  });

  describe('className merge', () => {
    it('lets a consumer className override the row layout', () => {
      render(<Checkbox className="gap-4">Subscribe</Checkbox>);
      const label = screen.getByText('Subscribe').closest('label');
      expect(label?.className.split(' ')).toContain('gap-4');
      expect(label?.className).not.toContain(
        'gap-[var(--component-checkbox-gap)]',
      );
    });
  });
});
