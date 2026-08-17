import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Link } from './Link';

describe('Link', () => {
  describe('rendering', () => {
    it('renders as a real anchor with an href', () => {
      render(<Link href="/docs">Documentation</Link>);
      const link = screen.getByRole('link', { name: 'Documentation' });
      expect(link).toHaveAttribute('href', '/docs');
    });

    it('is underlined by default with token-driven thickness and offset', () => {
      render(<Link href="/docs">Documentation</Link>);
      const className = screen.getByRole('link').className;
      expect(className).toContain('underline');
      expect(className).toContain(
        'decoration-[length:var(--component-link-underline-thickness)]',
      );
      expect(className).toContain(
        'underline-offset-[length:var(--component-link-underline-offset)]',
      );
    });

    it('drops the underline when underline is false', () => {
      render(
        <Link href="/docs" underline={false}>
          Documentation
        </Link>,
      );
      const className = screen.getByRole('link').className;
      expect(className).toContain('no-underline');
      expect(className.split(' ')).not.toContain('underline');
    });
  });

  describe('newWindow', () => {
    it('has no icon and no target by default', () => {
      render(<Link href="/docs">Documentation</Link>);
      const link = screen.getByRole('link');
      expect(link).not.toHaveAttribute('target');
      expect(screen.queryByText('(opens in a new window)')).toBeNull();
    });

    it('sets target and rel and shows the icon plus screen-reader text', () => {
      render(
        <Link href="/docs" newWindow>
          Documentation
        </Link>,
      );
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      expect(screen.getByText('(opens in a new window)')).toHaveClass(
        'sr-only',
      );
    });
  });

  describe('iconVerticalAlign', () => {
    it('defaults the trailing icon to bottom alignment', () => {
      const { container } = render(
        <Link href="/docs" newWindow>
          Documentation
        </Link>,
      );
      expect(container.querySelector('svg')).toHaveClass('align-text-bottom');
    });

    it('lets a consumer override to top or middle alignment', () => {
      const { container } = render(
        <Link href="/docs" newWindow iconVerticalAlign="start">
          Documentation
        </Link>,
      );
      expect(container.querySelector('svg')).toHaveClass('align-text-top');
    });
  });

  describe('asChild', () => {
    it('renders the child element instead of an anchor', () => {
      render(
        <Link asChild>
          <button type="button">Not really a link</button>
        </Link>,
      );
      expect(
        screen.getByRole('button', { name: 'Not really a link' }),
      ).toBeInTheDocument();
      expect(screen.queryByRole('link')).toBeNull();
    });
  });

  describe('className merge', () => {
    it('lets a consumer className override the default text color', () => {
      render(
        <Link href="/docs" className="text-critical">
          Documentation
        </Link>,
      );
      const className = screen.getByRole('link').className;
      expect(className.split(' ')).toContain('text-critical');
      expect(className).not.toContain(
        'text-[color:var(--component-link-text-color-default)]',
      );
    });
  });
});
