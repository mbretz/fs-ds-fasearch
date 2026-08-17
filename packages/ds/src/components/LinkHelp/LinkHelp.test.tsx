import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LinkHelp } from './LinkHelp';

describe('LinkHelp', () => {
  it('renders as a real anchor with a leading icon, top-aligned to the row and centered with a single line of text', () => {
    const { container } = render(
      <LinkHelp href="/help">How do I do this?</LinkHelp>,
    );
    const link = screen.getByRole('link', { name: 'How do I do this?' });
    expect(link).toHaveAttribute('href', '/help');
    expect(link.firstElementChild).toBe(container.querySelector('svg'));
    const className = link.className.split(' ');
    expect(className).toContain('inline-flex');
    expect(className).toContain('items-start');
    expect(link.className).toContain(
      'leading-[length:var(--component-link-icon-size-large)]',
    );
  });

  it('is never underlined', () => {
    render(<LinkHelp href="/help">How do I do this?</LinkHelp>);
    expect(screen.getByRole('link').className.split(' ')).toContain(
      'no-underline',
    );
  });

  describe('asChild', () => {
    it('renders the child element instead of an anchor', () => {
      render(
        <LinkHelp asChild>
          <button type="button">Not really a link</button>
        </LinkHelp>,
      );
      expect(
        screen.getByRole('button', { name: 'Not really a link' }),
      ).toBeInTheDocument();
      expect(screen.queryByRole('link')).toBeNull();
    });
  });
});
