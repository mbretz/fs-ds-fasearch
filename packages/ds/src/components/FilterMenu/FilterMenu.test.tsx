import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterMenu } from './FilterMenu';

function renderMenu(extraContentProps = {}) {
  return render(
    <FilterMenu.Root>
      <FilterMenu.Header>
        <FilterMenu.Trigger>Show Filters</FilterMenu.Trigger>
        <FilterMenu.ClearButton count={2}>Clear</FilterMenu.ClearButton>
      </FilterMenu.Header>
      <FilterMenu.Content {...extraContentProps}>
        <FilterMenu.Drawer>Drawer content</FilterMenu.Drawer>
        <FilterMenu.Footer>Footer content</FilterMenu.Footer>
      </FilterMenu.Content>
    </FilterMenu.Root>,
  );
}

describe('FilterMenu', () => {
  describe('open/close', () => {
    it('is closed by default and opens via Trigger', async () => {
      renderMenu();
      expect(screen.queryByText('Drawer content')).not.toBeInTheDocument();
      await userEvent.click(screen.getByText('Show Filters'));
      expect(screen.getByText('Drawer content')).toBeInTheDocument();
    });

    it('renders open via defaultOpen on Root', () => {
      render(
        <FilterMenu.Root defaultOpen>
          <FilterMenu.Header>
            <FilterMenu.Trigger>Show Filters</FilterMenu.Trigger>
          </FilterMenu.Header>
          <FilterMenu.Content>
            <FilterMenu.Drawer>Drawer content</FilterMenu.Drawer>
          </FilterMenu.Content>
        </FilterMenu.Root>,
      );
      expect(screen.getByText('Drawer content')).toBeInTheDocument();
    });

    it('calls onOpenChange when the trigger is clicked', async () => {
      const onOpenChange = vi.fn();
      render(
        <FilterMenu.Root onOpenChange={onOpenChange}>
          <FilterMenu.Header>
            <FilterMenu.Trigger>Show Filters</FilterMenu.Trigger>
          </FilterMenu.Header>
          <FilterMenu.Content>
            <FilterMenu.Drawer>Drawer content</FilterMenu.Drawer>
          </FilterMenu.Content>
        </FilterMenu.Root>,
      );
      await userEvent.click(screen.getByText('Show Filters'));
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it('closes on outside click', async () => {
      render(
        <div>
          <div>Outside</div>
          <FilterMenu.Root defaultOpen>
            <FilterMenu.Header>
              <FilterMenu.Trigger>Show Filters</FilterMenu.Trigger>
            </FilterMenu.Header>
            <FilterMenu.Content>
              <FilterMenu.Drawer>Drawer content</FilterMenu.Drawer>
            </FilterMenu.Content>
          </FilterMenu.Root>
        </div>,
      );
      expect(screen.getByText('Drawer content')).toBeInTheDocument();
      await userEvent.click(screen.getByText('Outside'));
      expect(screen.queryByText('Drawer content')).not.toBeInTheDocument();
    });

    it('closes on Escape', async () => {
      render(
        <FilterMenu.Root defaultOpen>
          <FilterMenu.Header>
            <FilterMenu.Trigger>Show Filters</FilterMenu.Trigger>
          </FilterMenu.Header>
          <FilterMenu.Content>
            <FilterMenu.Drawer>Drawer content</FilterMenu.Drawer>
          </FilterMenu.Content>
        </FilterMenu.Root>,
      );
      expect(screen.getByText('Drawer content')).toBeInTheDocument();
      await userEvent.keyboard('{Escape}');
      expect(screen.queryByText('Drawer content')).not.toBeInTheDocument();
    });
  });

  describe('ClearButton count badge', () => {
    it('renders the count only when provided', () => {
      const { rerender } = render(
        <FilterMenu.ClearButton>Clear</FilterMenu.ClearButton>,
      );
      expect(screen.queryByText('2')).not.toBeInTheDocument();

      rerender(
        <FilterMenu.ClearButton count={2}>Clear</FilterMenu.ClearButton>,
      );
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('does not toggle the panel when clicked', async () => {
      const onClick = vi.fn();
      renderMenu();
      await userEvent.click(screen.getByText('Clear'));
      expect(screen.queryByText('Drawer content')).not.toBeInTheDocument();
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('density', () => {
    it('sets data-density on Content when provided', async () => {
      renderMenu({ density: 'condensed' });
      await userEvent.click(screen.getByText('Show Filters'));
      expect(
        screen.getByText('Drawer content').closest('[data-density]'),
      ).toHaveAttribute('data-density', 'condensed');
    });
  });
});
