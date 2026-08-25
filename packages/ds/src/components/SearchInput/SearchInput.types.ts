import type {
  ComponentProps,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  RefObject,
} from 'react';
import type { Popover as PopoverPrimitive } from 'radix-ui';
import type { ButtonProps } from '../Button/Button.types';

export interface SearchInputContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  contentId: string;
  contentRef: RefObject<HTMLDivElement | null>;
  fieldRef: RefObject<HTMLInputElement | null>;
  /** Moves roving focus between the field and the suggestion options by `direction` steps. */
  moveFocus: (direction: 1 | -1) => void;
  /** Root's own live-measured rendered width in px — the upper bound `Suggestions` clamps its width to. */
  rootWidth: number | undefined;
}

export interface SearchInputRootProps extends ComponentProps<
  typeof PopoverPrimitive.Root
> {
  className?: string;
  density?: 'roomy' | 'condensed';
}

export type SearchInputInputGroupProps = ComponentProps<'div'>;

export interface SearchInputFieldProps extends Omit<
  ComponentProps<'input'>,
  'size' | 'type' | 'role'
> {
  density?: 'roomy' | 'condensed';
  /**
   * Trailing slot, defaults to a disabled-aware `SearchInput.ClearButton`
   * so consumers don't need to remember to wire one up — pass `onClick` to
   * actually clear your own value state, or override with `null`/a custom
   * node. Rendered as-is (not wrapped in an `aria-hidden` span the way
   * `TextInput.Field`'s own `iconEnd` is) since this slot is expected to
   * hold an interactive element, not a decorative icon.
   */
  iconEnd?: ReactNode;
}

export type SearchInputButtonProps = Omit<ButtonProps, 'variant'>;

export interface SearchInputClearButtonProps extends Omit<
  ComponentProps<'button'>,
  'type'
> {
  /** Overrides the default "Clear search" accessible name. */
  'aria-label'?: string;
}

/**
 * Figma's Menu-OptionsDrawer is portal-rendered, escaping any ancestor
 * data-density wrapper (same reasoning as Dialog.Content/SelectInput.Content)
 * — defaults to 'roomy' so every density-scoped CSS var it consumes still
 * resolves without a concrete ancestor.
 */
export interface SearchInputSuggestionsProps extends ComponentProps<
  typeof PopoverPrimitive.Content
> {
  density?: 'roomy' | 'condensed';
}

export interface SearchInputOptionProps extends Omit<
  ComponentProps<'button'>,
  'type' | 'role'
> {
  /** Fires when the option is chosen (click, Enter, or Space); the drawer closes and focus returns to the field afterward. */
  onSelect?: (
    event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>,
  ) => void;
}
