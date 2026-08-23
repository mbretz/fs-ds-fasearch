import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Chip } from './Chip';

describe('Chip', () => {
  describe('rendering', () => {
    it('renders the label text', () => {
      render(<Chip>Investors Nearing Retirement</Chip>);
      expect(
        screen.getByText('Investors Nearing Retirement'),
      ).toBeInTheDocument();
    });

    it('lets a consumer compose extra content around the label via the compound API', () => {
      render(
        <Chip.Root>
          <svg data-testid="icon" />
          <Chip.Label>Active</Chip.Label>
        </Chip.Root>,
      );
      const root = screen.getByText('Active').parentElement;
      expect(root).toContainElement(screen.getByTestId('icon'));
    });
  });

  describe('dismiss button', () => {
    it('does not render a close button when onDismiss is omitted', () => {
      render(<Chip>Active</Chip>);
      expect(
        screen.queryByRole('button', { name: 'Remove' }),
      ).not.toBeInTheDocument();
    });

    it('renders a close button when onDismiss is provided', () => {
      render(<Chip onDismiss={() => {}}>Active</Chip>);
      expect(
        screen.getByRole('button', { name: 'Remove' }),
      ).toBeInTheDocument();
    });

    it('calls onDismiss when the close button is activated', async () => {
      const user = userEvent.setup();
      const onDismiss = vi.fn();
      render(<Chip onDismiss={onDismiss}>Active</Chip>);
      await user.click(screen.getByRole('button', { name: 'Remove' }));
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('lets dismissLabel override the default accessible name', () => {
      render(
        <Chip onDismiss={() => {}} dismissLabel="Remove Active filter">
          Active
        </Chip>,
      );
      expect(
        screen.getByRole('button', { name: 'Remove Active filter' }),
      ).toBeInTheDocument();
    });

    it('lets a consumer wire dismissal through the compound API via plain onClick', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Chip.Root>
          <Chip.Label>Active</Chip.Label>
          <Chip.CloseButton aria-label="Remove Active" onClick={onClick} />
        </Chip.Root>,
      );
      await user.click(screen.getByRole('button', { name: 'Remove Active' }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('asChild', () => {
    it('renders the compound Root as the child element instead of a span', () => {
      render(
        <Chip.Root asChild>
          <a href="/filter">
            <Chip.Label>Active</Chip.Label>
          </a>
        </Chip.Root>,
      );
      const link = screen.getByRole('link', { name: 'Active' });
      expect(link).toHaveAttribute('href', '/filter');
    });
  });

  describe('className merge', () => {
    it('lets a consumer className override the default background', () => {
      render(<Chip className="bg-red-500">Active</Chip>);
      const root = screen.getByText('Active').parentElement!;
      expect(root.className.split(' ')).toContain('bg-red-500');
      expect(root.className).not.toContain(
        'bg-[var(--component-chip-background-color)]',
      );
    });
  });
});
