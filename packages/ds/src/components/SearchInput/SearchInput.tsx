import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type KeyboardEvent,
  type Ref,
} from 'react';
import { Popover as PopoverPrimitive } from 'radix-ui';
import { cva } from 'class-variance-authority';
import { CloseSm, Search } from 'icons';
import { cn } from '../../utils/cn';
import { Label } from '../Label/Label';
import { Microcopy } from '../Microcopy/Microcopy';
import { Button } from '../Button/Button';
import type {
  SearchInputContextValue,
  SearchInputRootProps,
  SearchInputInputGroupProps,
  SearchInputFieldProps,
  SearchInputButtonProps,
  SearchInputSuggestionsProps,
  SearchInputOptionProps,
  SearchInputClearButtonProps,
} from './SearchInput.types';

/**
 * A ref prop can only point at one destination — assigning `ref` twice on
 * the same JSX element just clobbers the first assignment. This component
 * needs two: an internal ref Root creates for its own focus-management
 * logic (`fieldRef`/`contentRef` in context, read by `moveFocus` and by
 * `Suggestions`' `onCloseAutoFocus`), plus whatever `ref` a consumer passes
 * in directly (the same forwarding every other DS field/content component
 * supports, e.g. `TextInput.Field`). `mergeRefs` returns one callback ref
 * that fans a single DOM node out to every ref given to it — a plain
 * object ref gets its `.current` set, a callback ref gets called — so both
 * the internal wiring and an external consumer ref stay attached to the
 * same node without either one overwriting the other.
 */
function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === 'function') ref(node);
      else (ref as { current: T | null }).current = node;
    }
  };
}

const SearchInputContext = createContext<SearchInputContextValue | null>(null);

function useSearchInputContext(component: string) {
  const context = useContext(SearchInputContext);
  if (!context) {
    throw new Error(
      `SearchInput.${component} must be used within SearchInput.Root`,
    );
  }
  return context;
}

function SearchInputRoot({
  className,
  density,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children,
  ...props
}: SearchInputRootProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const contentId = useId();
  const contentRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // Live-measured so `Suggestions` can clamp its own width between the
  // field's width (its min, via Radix Popper's own `--radix-popover-
  // trigger-width`, already anchored to the field) and Root's width (its
  // max, tracked here) — see `Suggestions`' own comment for how the two
  // bounds combine. A plain px number in state, not a CSS custom property
  // on Root: `Suggestions` is portaled to `document.body`, outside Root's
  // DOM subtree, so a CSS var set here wouldn't cascade to it — this has
  // to cross that boundary as a value, applied directly as an inline style
  // on the portaled node instead.
  const [rootWidth, setRootWidth] = useState<number | undefined>(undefined);
  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setRootWidth(entry.contentRect.width);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  /**
   * Roving focus between the field and the suggestion list. Radix ships no
   * Combobox/Listbox primitive, so there's no built-in keyboard-nav
   * behavior to lean on the way SelectInput leans on `Select.Item`'s
   * `data-[highlighted]` state — this is hand-built instead.
   *
   * Deliberately DOM-query-based (`querySelectorAll` inside `contentRef`
   * plus `document.activeElement`) rather than tracked as index state in
   * React (`activeIndex`, `setActiveIndex`): the option list is arbitrary
   * consumer-supplied JSX (`SearchInput.Option` children), not a fixed
   * array Root itself owns or renders, so there's no single place that
   * could hold a canonical "list of options" to index into without every
   * consumer registering/unregistering each option on mount — real
   * complexity for a feature (index-based nav) that's fully covered by
   * just moving real DOM focus. Real `<button>` focus is also strictly
   * more robust here: it makes `:focus`/`:hover` styling free (no
   * `data-highlighted` bookkeeping needed on `Option`, see its own
   * comment below) and Enter/Space-to-select come from native `<button>`
   * semantics rather than a synthetic keydown handler.
   *
   * `currentIndex === -1` means focus isn't on any option yet (it's still
   * on the field, or nowhere in the list) — `direction === 1` (ArrowDown)
   * jumps to the first option; `direction === -1` (ArrowUp, only called
   * from `Option`, never from `Field`) is a no-op, since there's nothing
   * "before" the field to move to. `nextIndex < 0` is how ArrowUp from the
   * *first* option returns focus to the field, rather than wrapping.
   * Moving past the last option intentionally clamps (`Math.min`) instead
   * of wrapping back to the first — matches most combobox implementations
   * and avoids the field/first-option ArrowUp path becoming ambiguous
   * with a wrapped-around last-option ArrowDown path.
   */
  const moveFocus = useCallback((direction: 1 | -1) => {
    const container = contentRef.current;
    if (!container) return;
    const options = Array.from(
      container.querySelectorAll<HTMLButtonElement>(
        '[role="option"]:not(:disabled)',
      ),
    );
    if (options.length === 0) return;

    const activeElement = document.activeElement;
    const currentIndex = options.indexOf(activeElement as HTMLButtonElement);

    if (currentIndex === -1) {
      if (direction === 1) options[0]?.focus();
      return;
    }

    const nextIndex = currentIndex + direction;
    if (nextIndex < 0) {
      fieldRef.current?.focus();
      return;
    }
    options[Math.min(nextIndex, options.length - 1)]?.focus();
  }, []);

  return (
    <div
      ref={rootRef}
      data-density={density}
      className={cn('flex flex-col', className)}
    >
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen} {...props}>
        <SearchInputContext.Provider
          value={{
            open,
            setOpen,
            contentId,
            contentRef,
            fieldRef,
            moveFocus,
            rootWidth,
          }}
        >
          {children}
        </SearchInputContext.Provider>
      </PopoverPrimitive.Root>
    </div>
  );
}
SearchInputRoot.displayName = 'SearchInput.Root';

// Flush row joining Field and Button into one pill, matching Figma's
// "Input+Button" frame (no gap between the two halves).
function SearchInputInputGroup({
  className,
  ...props
}: SearchInputInputGroupProps) {
  return <div className={cn('flex items-stretch', className)} {...props} />;
}
SearchInputInputGroup.displayName = 'SearchInput.InputGroup';

// Nudges Label/Microcopy text to align with the field's own inner content
// edge, rather than the outer edge of its 24px pill radius — Figma insets
// both by the same 16px used as the field's own padding-inline.
function SearchInputLabel({
  className,
  ...props
}: ComponentProps<typeof Label>) {
  return (
    <Label
      className={cn(
        'pl-[var(--component-search-input-label-padding-inline-start)]',
        className,
      )}
      {...props}
    />
  );
}
SearchInputLabel.displayName = 'SearchInput.Label';

function SearchInputMicrocopy({
  className,
  ...props
}: ComponentProps<typeof Microcopy>) {
  return (
    <Microcopy
      className={cn(
        'pl-[var(--component-search-input-label-microcopy-padding-inline-start)]',
        className,
      )}
      {...props}
    />
  );
}
SearchInputMicrocopy.displayName = 'SearchInput.Microcopy';

// `min-w-0` alongside `flex-1` is load-bearing: without it this wrapper
// refused to shrink below its content's min-content width, overflowing
// past `Button` and Root's own bounds.
export const searchInputFieldVariants = cva(
  'flex h-[var(--density-control-input-small-min-height)] min-w-0 flex-1 items-center gap-[var(--density-spacing-dynamic-large)] rounded-l-[var(--component-search-input-border-radius)] border-[length:var(--component-search-input-border-width)] border-[color:var(--component-search-input-border-color-default)] bg-[var(--component-search-input-background-color-default)] px-[var(--density-control-input-padding-inline)] py-[var(--density-control-input-padding-block)] focus-within:border-[color:var(--component-search-input-border-color-active)] focus-within:shadow-[inset_0_0_0_calc(var(--semantic-control-border-width-active)-var(--component-search-input-border-width))_var(--component-search-input-border-color-active)]',
  {
    variants: {
      state: {
        default: '',
        disabled:
          'border-[color:var(--component-search-input-border-color-disabled)] bg-[var(--component-search-input-background-color-disabled)]',
      },
    },
    defaultVariants: { state: 'default' },
  },
);

/**
 * `Popover.Anchor`, not `Popover.Trigger` — a Trigger toggles `open` on
 * click, which is wrong here (clicking into the field to type shouldn't
 * flip the drawer shut if it's already open, the way clicking a Select
 * trigger toggles its own dropdown). Anchor only supplies position; `open`
 * is driven entirely by Root's state, flipped by this field's own
 * ArrowDown/Escape handling and by whatever a consumer does in response to
 * typing (see the `onChange`-driven opening note in the story file).
 *
 * `role="combobox"` + `aria-expanded`/`aria-controls`/`aria-autocomplete`
 * on the `<input>` follow the WAI-ARIA 1.2 combobox-with-listbox-popup
 * pattern. This implementation intentionally diverges from the spec's
 * `aria-activedescendant` variant (where the input stays focused and a
 * visually-highlighted option is only *announced*, never actually
 * focused) in favor of moving real DOM focus into the option list — see
 * `moveFocus`'s own comment in `Root` for why. Screen readers still
 * announce role="option" elements as they receive real focus, so the
 * combobox's accessible relationship (`aria-controls` -> the listbox,
 * `aria-expanded` reflecting open state) is intact; only the specific
 * activedescendant technique is swapped for real focus.
 */
function SearchInputField({
  className,
  density,
  disabled,
  iconEnd = <SearchInputClearButton disabled={disabled} />,
  onKeyDown,
  ref,
  ...props
}: SearchInputFieldProps) {
  const { open, setOpen, contentId, fieldRef, moveFocus } =
    useSearchInputContext('Field');
  const state = disabled ? 'disabled' : 'default';

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!open) setOpen(true);
      else moveFocus(1);
    } else if (event.key === 'Escape' && open) {
      event.preventDefault();
      setOpen(false);
    }
  };

  return (
    <PopoverPrimitive.Anchor asChild>
      <div
        data-density={density}
        className={cn(searchInputFieldVariants({ state }), className)}
      >
        <span
          aria-hidden
          className="flex size-[var(--density-sizing-dynamic-xx-large)] shrink-0 items-center justify-center leading-none"
        >
          <Search aria-hidden />
        </span>
        <input
          ref={mergeRefs(ref, fieldRef)}
          type="search"
          role="combobox"
          aria-expanded={open}
          aria-controls={contentId}
          aria-autocomplete="list"
          disabled={disabled}
          onKeyDown={handleKeyDown}
          className={cn(
            // Hides the native `type="search"` UA cancel button — replaced
            // by `iconEnd` (typically `SearchInput.ClearButton`) instead.
            '[&::-webkit-search-cancel-button]:hidden min-w-0 flex-1 border-0 bg-transparent text-[length:var(--component-search-input-input-value-font-size)] font-[number:var(--component-search-input-input-value-font-weight)] outline-none',
            disabled
              ? 'text-[color:var(--component-search-input-text-color-disabled)]'
              : 'text-[color:var(--component-search-input-text-color-default)]',
          )}
          {...props}
        />
        {iconEnd}
      </div>
    </PopoverPrimitive.Anchor>
  );
}
SearchInputField.displayName = 'SearchInput.Field';

// Plain button, not a Popover.Trigger — submitting a search shouldn't
// toggle the suggestions drawer.
function SearchInputButton({
  className,
  children,
  ...props
}: SearchInputButtonProps) {
  return (
    <Button
      type="button"
      variant="primary"
      className={cn(
        'shrink-0 rounded-l-none rounded-r-[var(--component-search-input-button-border-radius)]',
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
SearchInputButton.displayName = 'SearchInput.Button';

// Bare button, not a `CloseButton` reuse — `CloseButton` wraps a full
// tertiary `Button` sized for a standalone control (min-height ~40-48px),
// which would overflow the field's own row. Same structure as
// `Chip.CloseButton`: the button itself carries no size utility (sized by
// its content), and the icon gets the fixed 16px `clearButton.iconSize`
// token directly, matching Chip's own `closeIcon.size`.
// Clicking this button natively shifts DOM focus onto it, then the
// consumer's onClick typically clears the value — which, via the standard
// `value && <ClearButton>` conditional, unmounts this very button. Without
// an explicit refocus, focus would drop to nothing for a render cycle
// (visible as a quick flicker of the field's focus ring) until something
// else happened to refocus it. Refocusing the field synchronously here,
// same as `Option`'s onClick does, closes that gap entirely rather than
// relying on a side effect of `Suggestions` closing.
function SearchInputClearButton({
  className,
  onClick,
  'aria-label': ariaLabel = 'Clear search',
  ref,
  ...props
}: SearchInputClearButtonProps) {
  const { fieldRef } = useSearchInputContext('ClearButton');

  return (
    <button
      ref={ref}
      type="button"
      aria-label={ariaLabel}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        fieldRef.current?.focus();
      }}
      className={cn(
        'inline-flex shrink-0 cursor-pointer items-center justify-center rounded-[var(--component-search-input-drawer-border-radius)] text-[color:var(--component-search-input-text-color-default)] hover:opacity-70 focus-visible:shadow-[inset_0_0_0_var(--semantic-control-border-width-active)_var(--component-search-input-text-color-default)] disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <CloseSm
        aria-hidden
        className="size-[var(--component-search-input-clear-button-icon-size)]"
      />
    </button>
  );
}
SearchInputClearButton.displayName = 'SearchInput.ClearButton';

const CONTENT_SIDE_OFFSET = 4;

// Mirrors `component.searchInput.drawer.offsetInlineStart` (spacing.fixed
// x-large, 20px — the distance Figma offsets Menu-OptionsDrawer from the
// root's left edge by). Popper's `alignOffset` takes a plain number, not a
// CSS var — packages/tokens ships no JS-importable token values (CSS
// custom properties are the only interface, per docs/PLAN.md's CSS-first
// deviation note), so the value is mirrored here as a named constant, same
// as `CONTENT_SIDE_OFFSET` above.
const CONTENT_ALIGN_OFFSET = 20;

/**
 * Container border/background reuse `component.searchInput`'s own
 * default-state tokens (the same ones `Field` uses) — Figma's
 * "Slot - SelectInput Drawer" inside Menu-OptionsDrawer renders with the
 * identical fill/stroke as the field itself, just a different radius
 * (`drawer.borderRadius`, 4px, vs. the field's 24px pill). `alignOffset`
 * shifts the drawer 20px right of the anchor's (the field's) own left
 * edge, matching Figma's absolute drawer position rather than flush-left
 * alignment.
 *
 * `onOpenAutoFocus` is prevented: Radix's default behavior moves focus
 * into `Content` the instant it mounts, which would yank focus off the
 * field the moment a suggestion appears while the person is still typing.
 * Focus only ever moves into the list explicitly, via ArrowDown
 * (`Field`'s handler / `moveFocus`).
 *
 * `onCloseAutoFocus` is also prevented and replaced with an explicit
 * `fieldRef.current?.focus()` — Radix's default on close returns focus to
 * whatever had it before open (which, since this uses Anchor rather than
 * Trigger, Radix can't reliably infer the same way it does for a
 * Trigger-driven popover). Doing it explicitly guarantees focus always
 * lands back on the field, regardless of how the drawer closed (Escape,
 * outside click, or a selected `Option`).
 *
 * `onEscapeKeyDown` closes explicitly rather than relying on Radix's
 * built-in dismiss-on-Escape alone: Root's `open` state is the single
 * source of truth every other piece of this component reads
 * (`Field`'s `aria-expanded`, `moveFocus`'s callers), so Escape needs to
 * flow through `setOpen` like every other close path, not bypass it via
 * Radix's internal-only dismiss handling.
 */
function SearchInputSuggestions({
  className,
  density = 'roomy',
  children,
  ref,
  ...props
}: SearchInputSuggestionsProps) {
  const { contentId, contentRef, setOpen, fieldRef, rootWidth } =
    useSearchInputContext('Suggestions');

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={mergeRefs(ref, contentRef)}
        id={contentId}
        role="listbox"
        data-density={density}
        align="start"
        alignOffset={CONTENT_ALIGN_OFFSET}
        sideOffset={CONTENT_SIDE_OFFSET}
        onOpenAutoFocus={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          fieldRef.current?.focus();
        }}
        onEscapeKeyDown={() => setOpen(false)}
        className={cn(
          'z-50 flex flex-col overflow-hidden rounded-[var(--component-search-input-drawer-border-radius)] border-[length:var(--component-search-input-border-width)] border-[color:var(--component-search-input-border-color-default)] bg-[var(--component-search-input-background-color-default)] shadow-elevation-raised',
          className,
        )}
        // `minWidth` subtracts 1x `CONTENT_ALIGN_OFFSET`: the drawer's left
        // edge starts 20px right of the field's own left edge, so the
        // default width lands flush with the field's own right edge (the
        // button's left edge). `maxWidth` subtracts 2x: the grown case
        // mirrors that same 20px inset on the right too, so it stays
        // inside Root's own rounded corner rather than landing flush.
        style={{
          minWidth: `calc(var(--radix-popover-trigger-width) - ${CONTENT_ALIGN_OFFSET}px)`,
          maxWidth:
            rootWidth !== undefined
              ? rootWidth - 2 * CONTENT_ALIGN_OFFSET
              : undefined,
        }}
        {...props}
      >
        {children}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
}
SearchInputSuggestions.displayName = 'SearchInput.Suggestions';

// Idle/hover only — unlike SelectInput.Option this has no persisted
// "selected" state (a search suggestion is chosen once, then the drawer
// closes; it never stays checked), so `component.searchInput.option` only
// defines default/highlighted colors, no selected-state pair.
function SearchInputOption({
  className,
  disabled,
  onSelect,
  onClick,
  onKeyDown,
  ref,
  children,
  ...props
}: SearchInputOptionProps) {
  const { setOpen, fieldRef, moveFocus } = useSearchInputContext('Option');

  return (
    <button
      ref={ref}
      type="button"
      role="option"
      aria-selected={false}
      disabled={disabled}
      tabIndex={-1}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        onSelect?.(event);
        setOpen(false);
        fieldRef.current?.focus();
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          moveFocus(1);
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          moveFocus(-1);
        } else if (event.key === 'Escape') {
          event.preventDefault();
          setOpen(false);
          fieldRef.current?.focus();
        }
      }}
      className={cn(
        'flex w-full cursor-pointer items-center gap-[var(--density-spacing-dynamic-large)] px-[var(--density-control-input-padding-inline)] py-[var(--density-control-input-padding-block)] text-left text-[length:var(--component-search-input-input-value-font-size)] font-[number:var(--component-search-input-input-value-font-weight)] text-[color:var(--component-search-input-option-text-color-default)] outline-none hover:bg-[var(--component-search-input-option-background-color-highlighted)] focus:bg-[var(--component-search-input-option-background-color-highlighted)] disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
SearchInputOption.displayName = 'SearchInput.Option';

export const SearchInput = {
  Root: SearchInputRoot,
  Label: SearchInputLabel,
  InputGroup: SearchInputInputGroup,
  Field: SearchInputField,
  ClearButton: SearchInputClearButton,
  Button: SearchInputButton,
  Microcopy: SearchInputMicrocopy,
  Suggestions: SearchInputSuggestions,
  Option: SearchInputOption,
};
