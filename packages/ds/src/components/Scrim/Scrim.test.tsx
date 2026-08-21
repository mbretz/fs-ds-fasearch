import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Scrim } from './Scrim';

describe('Scrim', () => {
  it('renders a fixed, full-bleed div styled from the scrim background token', () => {
    render(<Scrim data-testid="scrim" />);
    const el = screen.getByTestId('scrim');
    expect(el.tagName).toBe('DIV');
    expect(el.className).toContain('fixed');
    expect(el.className).toContain('inset-0');
    expect(el.className).toContain(
      'bg-[var(--component-scrim-background-color)]',
    );
  });

  describe('asChild', () => {
    it('renders onto the consumer-supplied element instead of a div', () => {
      render(
        <Scrim asChild data-testid="scrim">
          <span />
        </Scrim>,
      );
      expect(screen.getByTestId('scrim').tagName).toBe('SPAN');
    });
  });

  describe('className merge', () => {
    it('lets a consumer className override the default position', () => {
      render(<Scrim data-testid="scrim" className="absolute" />);
      const el = screen.getByTestId('scrim');
      expect(el.className.split(' ')).toContain('absolute');
      expect(el.className).not.toContain('fixed');
    });
  });
});
