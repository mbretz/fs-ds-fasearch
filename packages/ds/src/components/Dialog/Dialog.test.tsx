import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dialog } from './Dialog';

describe('Dialog', () => {
  describe('open/close', () => {
    it('is closed by default and opens via Trigger', async () => {
      render(
        <Dialog.Root>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Content title="Dialog Title">
            <Dialog.Body>Body content</Dialog.Body>
          </Dialog.Content>
        </Dialog.Root>,
      );
      expect(screen.queryByText('Body content')).not.toBeInTheDocument();
      await userEvent.click(screen.getByText('Open'));
      expect(screen.getByText('Body content')).toBeInTheDocument();
    });

    it('renders open via defaultOpen', () => {
      render(
        <Dialog.Root defaultOpen>
          <Dialog.Content title="Dialog Title">
            <Dialog.Body>Body content</Dialog.Body>
          </Dialog.Content>
        </Dialog.Root>,
      );
      expect(screen.getByText('Body content')).toBeInTheDocument();
    });

    it('calls onOpenChange when the trigger is clicked', async () => {
      const onOpenChange = vi.fn();
      render(
        <Dialog.Root onOpenChange={onOpenChange}>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Content title="Dialog Title">
            <Dialog.Body>Body content</Dialog.Body>
          </Dialog.Content>
        </Dialog.Root>,
      );
      await userEvent.click(screen.getByText('Open'));
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it('closes when the built-in close button is clicked', async () => {
      render(
        <Dialog.Root defaultOpen>
          <Dialog.Content title="Dialog Title">
            <Dialog.Body>Body content</Dialog.Body>
          </Dialog.Content>
        </Dialog.Root>,
      );
      expect(screen.getByText('Body content')).toBeInTheDocument();
      await userEvent.click(screen.getByRole('button', { name: 'Close' }));
      expect(screen.queryByText('Body content')).not.toBeInTheDocument();
    });

    it('closes via a consumer-placed Dialog.Close', async () => {
      render(
        <Dialog.Root defaultOpen>
          <Dialog.Content title="Dialog Title">
            <Dialog.Body>Body content</Dialog.Body>
            <Dialog.Footer>
              <Dialog.Close>Cancel</Dialog.Close>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>,
      );
      await userEvent.click(screen.getByText('Cancel'));
      expect(screen.queryByText('Body content')).not.toBeInTheDocument();
    });
  });

  describe('initial focus', () => {
    it('focuses the built-in close button on open, not Radix default Content focus', async () => {
      render(
        <Dialog.Root>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Content title="Dialog Title">
            <Dialog.Body>Body content</Dialog.Body>
          </Dialog.Content>
        </Dialog.Root>,
      );
      await userEvent.click(screen.getByText('Open'));
      expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
    });

    it('lets a consumer override the default via onOpenAutoFocus', async () => {
      const onOpenAutoFocus = vi.fn((event: Event) => event.preventDefault());
      render(
        <Dialog.Root>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Content
            title="Dialog Title"
            onOpenAutoFocus={onOpenAutoFocus}
          >
            <Dialog.Body>Body content</Dialog.Body>
          </Dialog.Content>
        </Dialog.Root>,
      );
      await userEvent.click(screen.getByText('Open'));
      expect(onOpenAutoFocus).toHaveBeenCalled();
      expect(screen.getByRole('button', { name: 'Close' })).not.toHaveFocus();
    });
  });

  describe('title/description', () => {
    it('always renders the title', () => {
      render(
        <Dialog.Root defaultOpen>
          <Dialog.Content title="Dialog Title">
            <Dialog.Body>Body content</Dialog.Body>
          </Dialog.Content>
        </Dialog.Root>,
      );
      expect(screen.getByText('Dialog Title')).toBeInTheDocument();
    });

    it('renders a description only when provided', () => {
      const { rerender } = render(
        <Dialog.Root defaultOpen>
          <Dialog.Content title="Dialog Title">
            <Dialog.Body>Body content</Dialog.Body>
          </Dialog.Content>
        </Dialog.Root>,
      );
      expect(screen.queryByText('A description')).not.toBeInTheDocument();

      rerender(
        <Dialog.Root defaultOpen>
          <Dialog.Content title="Dialog Title" description="A description">
            <Dialog.Body>Body content</Dialog.Body>
          </Dialog.Content>
        </Dialog.Root>,
      );
      expect(screen.getByText('A description')).toBeInTheDocument();
    });
  });

  describe('Header/Footer presence', () => {
    it('omits Header and Footer when not rendered', () => {
      render(
        <Dialog.Root defaultOpen>
          <Dialog.Content title="Dialog Title">
            <Dialog.Body>Body content</Dialog.Body>
          </Dialog.Content>
        </Dialog.Root>,
      );
      expect(screen.queryByText('Header content')).not.toBeInTheDocument();
      expect(screen.queryByText('Footer content')).not.toBeInTheDocument();
    });

    it('renders Header and Footer when present', () => {
      render(
        <Dialog.Root defaultOpen>
          <Dialog.Content title="Dialog Title">
            <Dialog.Header>Header content</Dialog.Header>
            <Dialog.Body>Body content</Dialog.Body>
            <Dialog.Footer>Footer content</Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>,
      );
      expect(screen.getByText('Header content')).toBeInTheDocument();
      expect(screen.getByText('Footer content')).toBeInTheDocument();
    });
  });

  describe('scrim', () => {
    it('renders a scrim by default', () => {
      render(
        <Dialog.Root defaultOpen>
          <Dialog.Content title="Dialog Title">
            <Dialog.Body>Body content</Dialog.Body>
          </Dialog.Content>
        </Dialog.Root>,
      );
      expect(
        document.querySelector(
          '.bg-\\[var\\(--component-scrim-background-color\\)\\]',
        ),
      ).not.toBeNull();
    });

    it('omits the scrim when showScrim is false', () => {
      render(
        <Dialog.Root defaultOpen>
          <Dialog.Content title="Dialog Title" showScrim={false}>
            <Dialog.Body>Body content</Dialog.Body>
          </Dialog.Content>
        </Dialog.Root>,
      );
      expect(
        document.querySelector(
          '.bg-\\[var\\(--component-scrim-background-color\\)\\]',
        ),
      ).toBeNull();
    });
  });

  describe('density', () => {
    it('sets data-density on the portal content root when provided', () => {
      render(
        <Dialog.Root defaultOpen>
          <Dialog.Content title="Dialog Title" density="condensed">
            <Dialog.Body>Body content</Dialog.Body>
          </Dialog.Content>
        </Dialog.Root>,
      );
      expect(
        screen.getByText('Dialog Title').closest('[data-density]'),
      ).toHaveAttribute('data-density', 'condensed');
    });
  });

  describe('className merge', () => {
    it('lets a consumer className override the default max-width', () => {
      render(
        <Dialog.Root defaultOpen>
          <Dialog.Content title="Dialog Title" className="max-w-full">
            <Dialog.Body>Body content</Dialog.Body>
          </Dialog.Content>
        </Dialog.Root>,
      );
      const content = screen
        .getByText('Dialog Title')
        .closest('[role="dialog"]');
      expect(content?.className.split(' ')).toContain('max-w-full');
      expect(content?.className).not.toContain(
        'max-w-[var(--component-dialog-max-width)]',
      );
    });
  });
});
