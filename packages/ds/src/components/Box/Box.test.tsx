import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Box, boxVariants } from './Box';

describe('Box', () => {
  it('renders a div by default', () => {
    render(<Box data-testid="box">content</Box>);
    expect(screen.getByTestId('box').tagName).toBe('DIV');
  });

  it('defaults to no padding', () => {
    render(<Box data-testid="box" />);
    expect(screen.getByTestId('box').className.split(' ')).toContain('p-0');
  });

  it('applies a padding step', () => {
    expect(boxVariants({ padding: 'large' })).toContain(
      'p-[var(--density-spacing-dynamic-large)]',
    );
  });

  it('renders as a different element via asChild', () => {
    render(
      <Box asChild data-testid="box">
        <section>content</section>
      </Box>,
    );
    expect(screen.getByTestId('box').tagName).toBe('SECTION');
  });

  it('lets a consumer className override the default padding', () => {
    render(<Box data-testid="box" padding="large" className="p-2" />);
    const el = screen.getByTestId('box');
    expect(el.className.split(' ')).toContain('p-2');
    expect(el.className).not.toContain(
      'p-[var(--density-spacing-dynamic-large)]',
    );
  });
});
