import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Card } from './Card';

describe('Card', () => {
  describe('rendering', () => {
    it('renders header title and description text', () => {
      render(
        <Card.Root>
          <Card.Header>
            <Card.HeaderTitle>Card Title</Card.HeaderTitle>
            <Card.HeaderDescription>Description</Card.HeaderDescription>
          </Card.Header>
          <Card.Body>Body content</Card.Body>
        </Card.Root>,
      );
      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Body content')).toBeInTheDocument();
    });

    it('renders the header icon when one is provided', () => {
      render(
        <Card.Root>
          <Card.Header>
            <Card.HeaderTitle icon={<svg data-testid="icon" />}>
              Card Title
            </Card.HeaderTitle>
          </Card.Header>
        </Card.Root>,
      );
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });
  });

  describe('expandable', () => {
    it('renders a plain, non-button header when not expandable', () => {
      render(
        <Card.Root>
          <Card.Header>
            <Card.HeaderTitle>Card Title</Card.HeaderTitle>
          </Card.Header>
        </Card.Root>,
      );
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('renders the whole header row as a single button when expandable', () => {
      render(
        <Card.Root>
          <Card.Header expandable>
            <Card.HeaderTitle>Card Title</Card.HeaderTitle>
            <Card.HeaderDescription>Description</Card.HeaderDescription>
          </Card.Header>
        </Card.Root>,
      );
      const button = screen.getByRole('button');
      expect(button).toContainElement(screen.getByText('Card Title'));
      expect(button).toContainElement(screen.getByText('Description'));
    });

    it('toggles data-state on the trigger when clicked', async () => {
      render(
        <Card.Root defaultOpen={false}>
          <Card.Header expandable>
            <Card.HeaderTitle>Card Title</Card.HeaderTitle>
          </Card.Header>
          <Card.Body>Body content</Card.Body>
        </Card.Root>,
      );
      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('data-state', 'closed');
      await userEvent.click(trigger);
      expect(trigger).toHaveAttribute('data-state', 'open');
    });

    it('calls onOpenChange when the trigger is clicked', async () => {
      const onOpenChange = vi.fn();
      render(
        <Card.Root defaultOpen={false} onOpenChange={onOpenChange}>
          <Card.Header expandable>
            <Card.HeaderTitle>Card Title</Card.HeaderTitle>
          </Card.Header>
          <Card.Body>Body content</Card.Body>
        </Card.Root>,
      );
      await userEvent.click(screen.getByRole('button'));
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it('defaults to open so a non-expandable Card always shows its body', () => {
      render(
        <Card.Root>
          <Card.Header>
            <Card.HeaderTitle>Card Title</Card.HeaderTitle>
          </Card.Header>
          <Card.Body>Body content</Card.Body>
        </Card.Root>,
      );
      expect(screen.getByText('Body content')).toBeInTheDocument();
    });
  });

  describe('collapse persistence', () => {
    // Confirmed explicitly with the user: Body/Footer must stay mounted in
    // the DOM while collapsed (a CSS-only visual collapse), not unmount —
    // the opposite of Radix Collapsible.Content's own default behavior.
    it('keeps Body and Footer content in the DOM while collapsed', () => {
      render(
        <Card.Root defaultOpen={false}>
          <Card.Header expandable>
            <Card.HeaderTitle>Card Title</Card.HeaderTitle>
          </Card.Header>
          <Card.Body>Body content</Card.Body>
          <Card.Footer>Footer content</Card.Footer>
        </Card.Root>,
      );
      expect(screen.getByText('Body content')).toBeInTheDocument();
      expect(screen.getByText('Footer content')).toBeInTheDocument();
    });

    // jsdom does no real layout (getBoundingClientRect/offsetHeight always
    // read 0), so a full collapse to 0px can't be asserted directly here —
    // same limitation noted for Tag/Tabs. This instead confirms the
    // grid-rows collapse mechanism (0fr closed, 1fr open) is wired up,
    // which is what actually drives the slide-up. TODO: duplicate/migrate
    // this case to the real-browser Storybook + Playwright env once
    // docs/TESTING_PLAN.md is implemented, to assert the actual 0px result.
    it('drives the collapse via a grid-rows transition keyed off data-state', () => {
      render(
        <Card.Root defaultOpen={false}>
          <Card.Header expandable>
            <Card.HeaderTitle>Card Title</Card.HeaderTitle>
          </Card.Header>
          <Card.Body>Body content</Card.Body>
        </Card.Root>,
      );
      const region = screen
        .getByText('Body content')
        .closest('[data-state]') as HTMLElement;
      expect(region.className).toContain('grid-rows-[0fr]');
      expect(region.className).toContain('data-[state=open]:grid-rows-[1fr]');
      expect(region).toHaveAttribute('data-state', 'closed');
    });

    // forceMount keeps Radix's own `hidden` attribute from ever being set
    // (see Card.tsx's comment above CardBody), so collapsed content relied
    // on the CSS-only grid-rows collapse alone and stayed in the a11y tree
    // and tab order while visually hidden. `visibility:hidden` closes that
    // gap; this asserts the class wiring, since jsdom can't assert the
    // resulting a11y-tree/tab-order exclusion itself.
    it('hides collapsed content from the a11y tree via visibility, deferred until the collapse animation finishes', () => {
      render(
        <Card.Root defaultOpen={false}>
          <Card.Header expandable>
            <Card.HeaderTitle>Card Title</Card.HeaderTitle>
          </Card.Header>
          <Card.Body>Body content</Card.Body>
        </Card.Root>,
      );
      const region = screen
        .getByText('Body content')
        .closest('[data-state]') as HTMLElement;
      expect(region.className).toContain('invisible');
      expect(region.className).toContain('data-[state=open]:visible');
      expect(region.className).toContain('data-[state=closed]:delay-200');
    });
  });

  describe('asChild', () => {
    it('renders Card.Root as the consumer-supplied element', () => {
      render(
        <Card.Root asChild>
          <section aria-label="account">
            <Card.Header>
              <Card.HeaderTitle>Card Title</Card.HeaderTitle>
            </Card.Header>
          </section>
        </Card.Root>,
      );
      expect(screen.getByRole('region', { name: 'account' }).tagName).toBe(
        'SECTION',
      );
    });
  });

  describe('header border', () => {
    it('shows a static bottom border on a non-expandable header by default', () => {
      render(
        <Card.Root>
          <Card.Header>
            <Card.HeaderTitle>Card Title</Card.HeaderTitle>
          </Card.Header>
        </Card.Root>,
      );
      const header = screen.getByText('Card Title').closest('div')!
        .parentElement as HTMLElement;
      expect(header.className).toContain(
        'border-b-[length:var(--component-card-header-border-border-width)]',
      );
      expect(header.className).not.toContain('data-[state=open]:border-b-');
    });

    it('hides the border on a non-expandable header when showBorder is false', () => {
      render(
        <Card.Root>
          <Card.Header showBorder={false}>
            <Card.HeaderTitle>Card Title</Card.HeaderTitle>
          </Card.Header>
        </Card.Root>,
      );
      const header = screen.getByText('Card Title').closest('div')!
        .parentElement as HTMLElement;
      expect(header.className).not.toContain(
        'border-b-[length:var(--component-card-header-border',
      );
    });

    it('applies the bottom-border classes only for the open state when expandable', () => {
      render(
        <Card.Root defaultOpen={false}>
          <Card.Header expandable>
            <Card.HeaderTitle>Card Title</Card.HeaderTitle>
          </Card.Header>
          <Card.Body>Body content</Card.Body>
        </Card.Root>,
      );
      const trigger = screen.getByRole('button');
      expect(trigger.className).toContain(
        'data-[state=open]:border-b-[length:var(--component-card-header-border-border-width)]',
      );
      expect(trigger.className).toContain(
        'data-[state=open]:border-b-[color:var(--component-card-header-border-border-color)]',
      );
      expect(trigger.className).not.toMatch(
        /(?<!data-\[state=open\]:)border-b-\[length:var\(--component-card-header-border/,
      );
    });

    it('disables the border outright on an expandable header when showBorder is false', () => {
      render(
        <Card.Root defaultOpen>
          <Card.Header expandable showBorder={false}>
            <Card.HeaderTitle>Card Title</Card.HeaderTitle>
          </Card.Header>
          <Card.Body>Body content</Card.Body>
        </Card.Root>,
      );
      const trigger = screen.getByRole('button');
      expect(trigger.className).not.toContain(
        'border-b-[length:var(--component-card-header-border',
      );
    });
  });

  describe('density', () => {
    it('sets data-density on the root when provided', () => {
      render(
        <Card.Root density="condensed">
          <Card.Header>
            <Card.HeaderTitle>Card Title</Card.HeaderTitle>
          </Card.Header>
        </Card.Root>,
      );
      expect(
        screen.getByText('Card Title').closest('[data-density]'),
      ).toHaveAttribute('data-density', 'condensed');
    });
  });

  describe('className merge', () => {
    it('lets a consumer className override the default background', () => {
      render(
        <Card.Root className="bg-red-500">
          <Card.Header>
            <Card.HeaderTitle>Card Title</Card.HeaderTitle>
          </Card.Header>
        </Card.Root>,
      );
      const root = screen
        .getByText('Card Title')
        .closest('.bg-red-500') as HTMLElement;
      expect(root).not.toBeNull();
      expect(root.className).not.toContain(
        'bg-[var(--component-card-background-color)]',
      );
    });
  });
});
