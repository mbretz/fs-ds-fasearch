import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Grid, gridVariants } from './Grid';

describe('Grid', () => {
  it('renders with the grid display class', () => {
    render(<Grid data-testid="grid" />);
    expect(screen.getByTestId('grid').className.split(' ')).toContain('grid');
  });

  it('sets gridTemplateColumns from the columns prop', () => {
    render(<Grid data-testid="grid" columns={3} />);
    expect(screen.getByTestId('grid').style.gridTemplateColumns).toBe(
      'repeat(3, minmax(0, 1fr))',
    );
  });

  it('leaves gridTemplateColumns unset when columns is omitted', () => {
    render(<Grid data-testid="grid" />);
    expect(screen.getByTestId('grid').style.gridTemplateColumns).toBe('');
  });

  it('applies independent column/row gap steps', () => {
    expect(gridVariants({ columnGap: 'large' })).toContain(
      'gap-x-[var(--density-spacing-dynamic-large)]',
    );
    expect(gridVariants({ rowGap: 'small' })).toContain(
      'gap-y-[var(--density-spacing-dynamic-small)]',
    );
  });

  it('applies align/justify', () => {
    render(<Grid data-testid="grid" align="center" justify="end" />);
    const classes = screen.getByTestId('grid').className.split(' ');
    expect(classes).toContain('items-center');
    expect(classes).toContain('justify-items-end');
  });

  it('also applies Box padding', () => {
    render(<Grid data-testid="grid" padding="small" />);
    expect(screen.getByTestId('grid').className).toContain(
      'p-[var(--density-spacing-dynamic-small)]',
    );
  });

  it('renders as a different element via asChild', () => {
    render(
      <Grid asChild data-testid="grid">
        <ul>content</ul>
      </Grid>,
    );
    expect(screen.getByTestId('grid').tagName).toBe('UL');
  });
});
