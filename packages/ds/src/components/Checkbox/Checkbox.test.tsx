import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox, checkboxLabelVariants } from './Checkbox';
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

    it('reflects unchecked/checked via data-state, driving the box color from CSS', () => {
      const { rerender } = render(<ControlledCheckbox />);
      expect(screen.getByRole('checkbox')).toHaveAttribute(
        'data-state',
        'unchecked',
      );
      rerender(<ControlledCheckbox checked />);
      expect(screen.getByRole('checkbox')).toHaveAttribute(
        'data-state',
        'checked',
      );
    });

    it('sets data-disabled even when checked, for CSS to override the checked color', () => {
      render(<ControlledCheckbox checked disabled />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('data-state', 'checked');
      expect(checkbox).toHaveAttribute('data-disabled');
    });

    it('sets data-disabled while indeterminate, with CSS (not JS) choosing the glyph', () => {
      render(
        <Checkbox disabled checked="indeterminate">
          Select all
        </Checkbox>,
      );
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('data-disabled');
      expect(checkbox).toHaveAttribute('data-state', 'indeterminate');

      // Both glyphs stay mounted — visibility is data-state-driven CSS, not
      // a JS branch on the `checked` prop, so this must hold whether
      // Checkbox is controlled or genuinely uncontrolled.
      const checkGlyph = screen.getByTestId('checkbox-check-glyph');
      expect(checkGlyph.closest('span')?.className.split(' ')).toContain(
        'group-data-[state=checked]:block',
      );
      const indeterminateGlyph = screen.getByTestId(
        'checkbox-indeterminate-glyph',
      );
      expect(
        indeterminateGlyph.closest('span')?.className.split(' '),
      ).toContain('group-data-[state=indeterminate]:block');
    });

    it('applies the error label color without changing the box state', () => {
      render(<Checkbox error>Subscribe</Checkbox>);
      expect(screen.getByText('Subscribe').className).toBe(
        cn(checkboxLabelVariants({ state: 'error' })),
      );
      expect(screen.getByRole('checkbox')).toHaveAttribute(
        'data-state',
        'unchecked',
      );
    });
  });

  describe('uncontrolled usage', () => {
    it('updates data-state on click when using defaultChecked, not checked/onCheckedChange', async () => {
      const user = userEvent.setup();
      render(<Checkbox defaultChecked={false}>Subscribe</Checkbox>);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('data-state', 'unchecked');
      await user.click(checkbox);
      expect(checkbox).toHaveAttribute('data-state', 'checked');
    });

    it('starts indeterminate via defaultChecked and cycles through click, all reflected by data-state', async () => {
      const user = userEvent.setup();
      render(<Checkbox defaultChecked="indeterminate">Select all</Checkbox>);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('data-state', 'indeterminate');
      await user.click(checkbox);
      expect(checkbox).toHaveAttribute('data-state', 'checked');
      await user.click(checkbox);
      expect(checkbox).toHaveAttribute('data-state', 'unchecked');
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
