import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchInput } from './SearchInput';

function renderSearchInput({
  rootProps = {},
  fieldProps = {},
  onSelectApple,
  suggestions = (
    <>
      <SearchInput.Option onSelect={onSelectApple}>Apple</SearchInput.Option>
      <SearchInput.Option>Banana</SearchInput.Option>
    </>
  ),
}: {
  rootProps?: Partial<React.ComponentProps<typeof SearchInput.Root>>;
  fieldProps?: Partial<React.ComponentProps<typeof SearchInput.Field>>;
  onSelectApple?: () => void;
  suggestions?: ReactNode;
} = {}) {
  return render(
    <SearchInput.Root {...rootProps}>
      <SearchInput.Label htmlFor="fruit-search">Search fruit</SearchInput.Label>
      <SearchInput.InputGroup>
        <SearchInput.Field
          id="fruit-search"
          placeholder="Search"
          {...fieldProps}
        />
        <SearchInput.Button>Search</SearchInput.Button>
      </SearchInput.InputGroup>
      <SearchInput.Suggestions
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        {suggestions}
      </SearchInput.Suggestions>
    </SearchInput.Root>,
  );
}

describe('SearchInput', () => {
  describe('composition', () => {
    it('renders Root, Label, Field, Button, and Microcopy together', () => {
      render(
        <SearchInput.Root>
          <SearchInput.Label htmlFor="basic-search">
            Search fruit
          </SearchInput.Label>
          <SearchInput.InputGroup>
            <SearchInput.Field id="basic-search" placeholder="Search" />
            <SearchInput.Button>Search</SearchInput.Button>
          </SearchInput.InputGroup>
          <SearchInput.Microcopy>This is helpful text.</SearchInput.Microcopy>
        </SearchInput.Root>,
      );
      expect(screen.getByText('Search fruit')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByText('This is helpful text.')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Search' }),
      ).toBeInTheDocument();
    });
  });

  describe('opening via ArrowDown', () => {
    it('is closed by default and opens on ArrowDown', async () => {
      const user = userEvent.setup();
      renderSearchInput();
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

      const field = screen.getByRole('combobox');
      await user.click(field);
      await user.keyboard('{ArrowDown}');

      expect(screen.getByRole('listbox')).toBeInTheDocument();
      expect(field).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('roving focus between the field and the option list', () => {
    it('moves focus into the first option on ArrowDown when already open', async () => {
      const user = userEvent.setup();
      renderSearchInput({ rootProps: { defaultOpen: true } });
      const field = screen.getByRole('combobox');
      await user.click(field);
      await user.keyboard('{ArrowDown}');

      expect(document.activeElement).toBe(
        screen.getByRole('option', { name: 'Apple' }),
      );
    });

    it('moves focus to the next option on a second ArrowDown', async () => {
      const user = userEvent.setup();
      renderSearchInput({ rootProps: { defaultOpen: true } });
      await user.click(screen.getByRole('combobox'));
      await user.keyboard('{ArrowDown}{ArrowDown}');

      expect(document.activeElement).toBe(
        screen.getByRole('option', { name: 'Banana' }),
      );
    });

    it('clamps at the last option rather than wrapping around', async () => {
      const user = userEvent.setup();
      renderSearchInput({ rootProps: { defaultOpen: true } });
      await user.click(screen.getByRole('combobox'));
      await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}');

      expect(document.activeElement).toBe(
        screen.getByRole('option', { name: 'Banana' }),
      );
    });

    it('returns focus to the field on ArrowUp from the first option', async () => {
      const user = userEvent.setup();
      renderSearchInput({ rootProps: { defaultOpen: true } });
      const field = screen.getByRole('combobox');
      await user.click(field);
      await user.keyboard('{ArrowDown}{ArrowUp}');

      expect(document.activeElement).toBe(field);
    });
  });

  describe('closing', () => {
    it('closes on Escape from the field', async () => {
      const user = userEvent.setup();
      renderSearchInput({ rootProps: { defaultOpen: true } });
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      await user.click(screen.getByRole('combobox'));
      await user.keyboard('{Escape}');

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('selecting an option', () => {
    it('calls onSelect, closes the drawer, and returns focus to the field', async () => {
      const user = userEvent.setup();
      const onSelectApple = vi.fn();
      renderSearchInput({
        rootProps: { defaultOpen: true },
        onSelectApple,
      });
      const field = screen.getByRole('combobox');

      await user.click(screen.getByRole('option', { name: 'Apple' }));

      expect(onSelectApple).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(document.activeElement).toBe(field);
    });
  });

  describe('ClearButton default', () => {
    it("Field defaults iconEnd to a 'Clear search' button without extra wiring", () => {
      renderSearchInput();
      expect(
        screen.getByRole('button', { name: 'Clear search' }),
      ).toBeInTheDocument();
    });

    it('disables the default ClearButton when the field is disabled', () => {
      renderSearchInput({ fieldProps: { disabled: true } });
      expect(
        screen.getByRole('button', { name: 'Clear search' }),
      ).toBeDisabled();
    });

    it('returns focus to the field synchronously when clicked', async () => {
      const user = userEvent.setup();
      renderSearchInput();
      const field = screen.getByRole('combobox');
      const clearButton = screen.getByRole('button', { name: 'Clear search' });

      await user.click(clearButton);

      expect(document.activeElement).toBe(field);
    });

    it('still fires a consumer-supplied onClick before refocusing', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <SearchInput.Root>
          <SearchInput.InputGroup>
            <SearchInput.Field
              id="clear-search"
              placeholder="Search"
              iconEnd={<SearchInput.ClearButton onClick={onClick} />}
            />
          </SearchInput.InputGroup>
        </SearchInput.Root>,
      );

      await user.click(screen.getByRole('button', { name: 'Clear search' }));

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Suggestions width clamp', () => {
    // Radix's Popover.Content sets up its own ResizeObserver internally
    // (floating-ui's auto-update), so more than one gets constructed per
    // render — capture every {node, callback} pair and pick the one
    // observing Root's own element (identified by its fixed `flex
    // flex-col` className) rather than assuming "the last one constructed"
    // is ours.
    const observed: Array<{ node: Element; callback: ResizeObserverCallback }> =
      [];

    class StubResizeObserver {
      #callback: ResizeObserverCallback;
      constructor(callback: ResizeObserverCallback) {
        this.#callback = callback;
      }
      observe(node: Element) {
        observed.push({ node, callback: this.#callback });
      }
      unobserve() {}
      disconnect() {}
    }

    beforeEach(() => {
      observed.length = 0;
      vi.stubGlobal('ResizeObserver', StubResizeObserver);
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    function fireRootResize(width: number) {
      const rootNode = screen.getByRole('combobox').closest('.flex.flex-col');
      const match = observed.find((entry) => entry.node === rootNode);
      act(() => {
        match?.callback(
          [{ contentRect: { width } } as ResizeObserverEntry],
          {} as ResizeObserver,
        );
      });
    }

    it("clamps maxWidth to Root's measured width minus the double inset", () => {
      renderSearchInput({ rootProps: { defaultOpen: true } });

      fireRootResize(300);

      // 300px Root width - 2x the 20px inline inset (once for the drawer's
      // own left offset, once mirrored on the right) = 260px.
      expect(screen.getByRole('listbox')).toHaveStyle({ maxWidth: '260px' });
    });

    it('leaves maxWidth unset until Root has been measured', () => {
      renderSearchInput({ rootProps: { defaultOpen: true } });
      expect(screen.getByRole('listbox').style.maxWidth).toBe('');
    });
  });
});
