import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScrollArea, scrollAreaScrollbarVariants } from './ScrollArea';

describe('ScrollArea', () => {
  it('renders children inside the viewport', () => {
    render(
      <ScrollArea data-testid="root">
        <div data-testid="content">content</div>
      </ScrollArea>,
    );
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('sets data-density on the root when provided', () => {
    render(<ScrollArea data-testid="root" density="condensed" />);
    expect(screen.getByTestId('root')).toHaveAttribute(
      'data-density',
      'condensed',
    );
  });

  // Radix's Scrollbar only mounts once its internal ResizeObserver
  // detects real content/viewport overflow -- jsdom reports every size as
  // 0, so it never mounts here regardless of `horizontal`. Same
  // jsdom-can't-do-real-layout gap docs/TESTING_PLAN.md exists for;
  // covered at the class-string level below instead of DOM presence.
  it('uses distinct classes per scrollbar orientation', () => {
    expect(scrollAreaScrollbarVariants({ orientation: 'vertical' })).toContain(
      'h-full',
    );
    expect(
      scrollAreaScrollbarVariants({ orientation: 'horizontal' }),
    ).toContain('h-[var(--density-sizing-dynamic-small)]');
  });

  it('exposes the compound API', () => {
    expect(ScrollArea.Root).toBeDefined();
    expect(ScrollArea.Viewport).toBeDefined();
    expect(ScrollArea.Scrollbar).toBeDefined();
    expect(ScrollArea.Thumb).toBeDefined();
    expect(ScrollArea.Corner).toBeDefined();
  });

  it('composes the compound parts directly', () => {
    render(
      <ScrollArea.Root data-testid="root">
        <ScrollArea.Viewport>
          <div data-testid="content">content</div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
        <ScrollArea.Corner />
      </ScrollArea.Root>,
    );
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });
});
