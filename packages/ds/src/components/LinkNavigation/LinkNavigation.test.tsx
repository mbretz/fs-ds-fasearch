import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LinkNavigation } from './LinkNavigation';

describe('LinkNavigation', () => {
  it('places the chevron before the label for direction="previous"', () => {
    render(
      <LinkNavigation href="#" direction="previous">
        Prev
      </LinkNavigation>,
    );
    const link = screen.getByRole('link', { name: 'Prev' });
    const [icon, label] = Array.from(link.childNodes);
    expect(icon.nodeName).toBe('svg');
    expect(label.textContent).toBe('Prev');
  });

  it('places the chevron after the label for direction="next"', () => {
    render(
      <LinkNavigation href="#" direction="next">
        Next
      </LinkNavigation>,
    );
    const link = screen.getByRole('link', { name: 'Next' });
    const [label, icon] = Array.from(link.childNodes);
    expect(label.textContent).toBe('Next');
    expect(icon.nodeName).toBe('svg');
  });

  it('is never underlined', () => {
    render(
      <LinkNavigation href="#" direction="next">
        Next
      </LinkNavigation>,
    );
    expect(screen.getByRole('link').className.split(' ')).toContain(
      'no-underline',
    );
  });

  describe('asChild', () => {
    it('renders a single consumer-provided child as a button, not an anchor', () => {
      render(
        <LinkNavigation asChild direction="next">
          <button type="button">Next page</button>
        </LinkNavigation>,
      );
      expect(
        screen.getByRole('button', { name: 'Next page' }),
      ).toBeInTheDocument();
      expect(screen.queryByRole('link')).toBeNull();
    });

    it('still injects the chevron into the consumer-provided element', () => {
      render(
        <LinkNavigation asChild direction="next">
          <button type="button">Next page</button>
        </LinkNavigation>,
      );
      const button = screen.getByRole('button', { name: 'Next page' });
      expect(button.querySelector('svg')).not.toBeNull();
    });

    it("preserves the consumer element's own content alongside the chevron", () => {
      render(
        <LinkNavigation asChild direction="previous">
          <button type="button">
            <span data-testid="custom-content">Prev page</span>
          </button>
        </LinkNavigation>,
      );
      expect(screen.getByTestId('custom-content')).toHaveTextContent(
        'Prev page',
      );
    });
  });
});
