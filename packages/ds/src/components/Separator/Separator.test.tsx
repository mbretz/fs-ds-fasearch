import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Separator, separatorVariants } from './Separator';

describe('Separator', () => {
  describe('orientation', () => {
    it('defaults to horizontal', () => {
      render(<Separator data-testid="sep" />);
      expect(screen.getByTestId('sep')).toHaveAttribute(
        'data-orientation',
        'horizontal',
      );
    });

    it('sets aria/data attributes for vertical', () => {
      render(<Separator data-testid="sep" orientation="vertical" />);
      expect(screen.getByTestId('sep')).toHaveAttribute(
        'data-orientation',
        'vertical',
      );
    });

    it('uses distinct classes for horizontal and vertical', () => {
      expect(separatorVariants({ orientation: 'horizontal' })).not.toBe(
        separatorVariants({ orientation: 'vertical' }),
      );
    });

    it('sizes full-width/thin for horizontal and full-height/thin for vertical', () => {
      const horizontal = separatorVariants({ orientation: 'horizontal' });
      const vertical = separatorVariants({ orientation: 'vertical' });
      expect(horizontal).toContain('w-full');
      expect(horizontal).toContain(
        'h-[length:var(--component-separator-thickness)]',
      );
      expect(vertical).toContain('h-full');
      expect(vertical).toContain(
        'w-[length:var(--component-separator-thickness)]',
      );
    });

    it('references a per-orientation gradient token', () => {
      expect(separatorVariants({ orientation: 'horizontal' })).toContain(
        'bg-[image:var(--component-separator-gradient-horizontal)]',
      );
      expect(separatorVariants({ orientation: 'vertical' })).toContain(
        'bg-[image:var(--component-separator-gradient-vertical)]',
      );
    });
  });

  describe('accessibility', () => {
    it('exposes role="separator" by default, matching Radix defaults', () => {
      render(<Separator data-testid="sep" />);
      expect(screen.getByTestId('sep')).toHaveAttribute('role', 'separator');
    });

    it('is removed from the accessibility tree when decorative is true', () => {
      render(<Separator data-testid="sep" decorative />);
      expect(screen.getByTestId('sep')).toHaveAttribute('role', 'none');
    });
  });

  describe('className merge', () => {
    it('lets a consumer className override the default thickness', () => {
      render(<Separator data-testid="sep" className="h-2" />);
      const el = screen.getByTestId('sep');
      expect(el.className.split(' ')).toContain('h-2');
      expect(el.className).not.toContain(
        'h-[length:var(--component-separator-thickness)]',
      );
    });
  });
});
