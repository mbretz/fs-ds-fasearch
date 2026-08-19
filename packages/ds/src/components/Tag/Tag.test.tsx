import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Tag, tagRootVariants } from './Tag';

describe('Tag', () => {
  describe('rendering', () => {
    it('renders the label text', () => {
      render(<Tag>Active</Tag>);
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('lets a consumer compose extra content around the label via the compound API', () => {
      render(
        <Tag.Root>
          <svg data-testid="icon" />
          <Tag.Label>Active</Tag.Label>
        </Tag.Root>,
      );
      const root = screen.getByText('Active').parentElement;
      expect(root).toContainElement(screen.getByTestId('icon'));
    });
  });

  describe('height', () => {
    it('uses a min-height, not a fixed height, per size', () => {
      render(<Tag size="sm">Active</Tag>);
      const className = screen.getByText('Active').parentElement!.className;
      expect(className).toContain(
        'min-h-[var(--component-tag-min-height-small)]',
      );
      expect(className).not.toMatch(/(?<!min-)h-\[var\(--component-tag/);
    });

    it('subtracts the base border-width from padding so the border never grows the box', () => {
      render(<Tag>Active</Tag>);
      const className = screen.getByText('Active').parentElement!.className;
      expect(className).toContain(
        'py-[calc(var(--component-tag-padding-block-large)-var(--component-tag-border-width))]',
      );
    });

    // jsdom does no real layout (getBoundingClientRect/offsetHeight always
    // read 0), so pixel height can't be asserted directly here — same
    // limitation noted for Tabs' layout-shift test. This instead confirms
    // the height-determining classes (min-h, padding-block calc) are
    // untouched by borderWidth, which is what actually guarantees two
    // non-wrapped tags render at the same height regardless of borderWidth.
    it('keeps non-wrapped tags the same height across different borderWidth values', () => {
      render(
        <>
          <Tag borderWidth="default">Thin</Tag>
          <Tag borderWidth="heavy">Thick</Tag>
        </>,
      );
      const heightClasses = (el: Element) =>
        el.className
          .split(' ')
          .filter((c) => c.startsWith('min-h-') || c.startsWith('py-'));
      const thin = screen.getByText('Thin').parentElement!;
      const thick = screen.getByText('Thick').parentElement!;
      expect(heightClasses(thin)).toEqual(heightClasses(thick));
    });
  });

  describe('variant', () => {
    it('defaults to generic', () => {
      expect(tagRootVariants({})).toBe(tagRootVariants({ variant: 'generic' }));
    });

    it('produces distinct output per variant', () => {
      const variants = ['generic', 'teal', 'red', 'gold'] as const;
      const outputs = variants.map((variant) => tagRootVariants({ variant }));
      expect(new Set(outputs).size).toBe(variants.length);
    });
  });

  describe('borderWidth', () => {
    it('applies shadow-none at the default step', () => {
      expect(tagRootVariants({ borderWidth: 'default' })).toContain(
        'shadow-none',
      );
    });

    it('applies a variant-matched inset shadow at heavy, not a fixed border-width', () => {
      const heavy = tagRootVariants({ variant: 'teal', borderWidth: 'heavy' });
      expect(heavy).toContain(
        'shadow-[inset_0_0_0_calc(var(--semantic-control-border-width-heavy)-var(--component-tag-border-width))_var(--component-tag-border-color-teal)]',
      );
      expect(heavy).toContain(
        'border-[length:var(--component-tag-border-width)]',
      );
    });
  });

  describe('asChild', () => {
    it('renders the compound Root as the child element instead of a span', () => {
      render(
        <Tag.Root asChild>
          <a href="/filter">
            <Tag.Label>Active</Tag.Label>
          </a>
        </Tag.Root>,
      );
      const link = screen.getByRole('link', { name: 'Active' });
      expect(link).toHaveAttribute('href', '/filter');
    });
  });

  describe('className merge', () => {
    it('lets a consumer className override the default background', () => {
      render(<Tag className="bg-red-500">Active</Tag>);
      const root = screen.getByText('Active').parentElement!;
      expect(root.className.split(' ')).toContain('bg-red-500');
      expect(root.className).not.toContain(
        'bg-[var(--component-tag-background-color-generic)]',
      );
    });
  });
});
