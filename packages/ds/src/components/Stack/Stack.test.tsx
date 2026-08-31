import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Stack, stackVariants } from './Stack';

describe('Stack', () => {
  it('defaults to a column with no gap', () => {
    render(<Stack data-testid="stack" />);
    const classes = screen.getByTestId('stack').className.split(' ');
    expect(classes).toContain('flex-col');
    expect(classes).toContain('gap-0');
  });

  it('switches to a row', () => {
    render(<Stack data-testid="stack" direction="row" />);
    expect(screen.getByTestId('stack').className.split(' ')).toContain(
      'flex-row',
    );
  });

  it('applies a gap step', () => {
    expect(stackVariants({ gap: 'med' })).toContain(
      'gap-[var(--density-spacing-dynamic-med)]',
    );
  });

  it('applies align/justify/wrap', () => {
    render(<Stack data-testid="stack" align="center" justify="between" wrap />);
    const classes = screen.getByTestId('stack').className.split(' ');
    expect(classes).toContain('items-center');
    expect(classes).toContain('justify-between');
    expect(classes).toContain('flex-wrap');
  });

  it('also applies Box padding', () => {
    render(<Stack data-testid="stack" padding="small" />);
    expect(screen.getByTestId('stack').className).toContain(
      'p-[var(--density-spacing-dynamic-small)]',
    );
  });

  it('renders as a different element via asChild', () => {
    render(
      <Stack asChild data-testid="stack">
        <ul>content</ul>
      </Stack>,
    );
    expect(screen.getByTestId('stack').tagName).toBe('UL');
  });
});
