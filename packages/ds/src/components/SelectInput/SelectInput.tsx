import { Select as SelectPrimitive } from 'radix-ui';
import { cva } from 'class-variance-authority';
import { CaretDown, Checkmark } from 'icons';
import { cn } from '../../utils/cn';
import { Label } from '../Label/Label';
import { Microcopy } from '../Microcopy/Microcopy';
import type {
  SelectInputRootProps,
  SelectInputTriggerProps,
  SelectInputContentProps,
  SelectInputOptionProps,
} from './SelectInput.types';

export const selectInputTriggerVariants = cva(
  'flex w-full min-w-[var(--component-select-input-input-field-min-width)] items-center justify-between gap-[var(--density-spacing-dynamic-large)] rounded-[var(--component-select-input-border-radius)] border-[length:var(--component-select-input-border-width)] border-[color:var(--component-select-input-border-color-default)] bg-[var(--component-select-input-background-color-default)] pl-[var(--density-control-input-padding-inline)] pr-[var(--density-control-input-padding-inline)] py-[var(--density-control-input-padding-block)] outline-none focus:border-[color:var(--component-select-input-border-color-active)] focus:shadow-[inset_0_0_0_calc(var(--semantic-control-border-width-active)-var(--component-select-input-border-width))_var(--component-select-input-border-color-active)] data-[disabled]:cursor-not-allowed',
  {
    variants: {
      state: {
        default: '',
        error:
          'border-[color:var(--component-select-input-border-color-error)] bg-[var(--component-select-input-background-color-error)]',
        disabled:
          'border-[color:var(--component-select-input-border-color-disabled)] bg-[var(--component-select-input-background-color-disabled)]',
        'read-only': 'border-transparent pl-0',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  },
);

function SelectInputRoot({
  className,
  density,
  children,
  ...props
}: SelectInputRootProps) {
  return (
    <div data-density={density} className={cn('flex flex-col', className)}>
      <SelectPrimitive.Root {...props}>{children}</SelectPrimitive.Root>
    </div>
  );
}
SelectInputRoot.displayName = 'SelectInput.Root';

function SelectInputTrigger({
  className,
  error = false,
  readOnly = false,
  disabled,
  placeholder,
  density,
  children,
  ...props
}: SelectInputTriggerProps) {
  const state = disabled
    ? 'disabled'
    : error
      ? 'error'
      : readOnly
        ? 'read-only'
        : 'default';

  return (
    <SelectPrimitive.Trigger
      data-density={density}
      disabled={disabled}
      className={cn(selectInputTriggerVariants({ state }), className)}
      {...props}
    >
      <SelectPrimitive.Value
        placeholder={placeholder}
        className="min-w-0 flex-1 truncate text-left text-[length:var(--component-select-input-input-value-font-size)] font-[number:var(--component-select-input-input-value-font-weight)] text-[color:var(--component-select-input-input-value-text-color)]"
      >
        {children}
      </SelectPrimitive.Value>
      <SelectPrimitive.Icon asChild>
        <CaretDown
          aria-hidden
          className="size-[var(--density-sizing-dynamic-xx-large)] shrink-0"
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}
SelectInputTrigger.displayName = 'SelectInput.Trigger';

// Defaults to 'roomy' (the DS-wide default density, docs/PLAN.md §1.4) —
// Content is portal-rendered to document.body, escaping any ancestor
// data-density wrapper, so without a concrete fallback here every
// density-scoped CSS var used inside the dropdown would silently fail to
// resolve. Same reasoning as Dialog.Content.
function SelectInputContent({
  className,
  density = 'roomy',
  children,
  ...props
}: SelectInputContentProps) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-density={density}
        position="popper"
        sideOffset={4}
        className={cn(
          'z-50 min-w-[var(--component-select-input-dropdown-min-width)] overflow-hidden rounded-[var(--component-select-input-border-radius)] border-[length:var(--component-select-input-border-width)] border-[color:var(--component-select-input-border-color-default)] bg-[var(--component-select-input-background-color-default)] shadow-elevation-raised',
          className,
        )}
        style={{ width: 'var(--radix-select-trigger-width)' }}
        {...props}
      >
        <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}
SelectInputContent.displayName = 'SelectInput.Content';

function SelectInputOption({
  className,
  children,
  ...props
}: SelectInputOptionProps) {
  return (
    <SelectPrimitive.Item
      className={cn(
        'flex cursor-pointer items-center gap-[var(--density-spacing-dynamic-large)] px-[var(--density-control-input-padding-inline)] py-[var(--density-control-input-padding-block)] text-[length:var(--component-select-input-input-value-font-size)] font-[number:var(--component-select-input-input-value-font-weight)] text-[color:var(--component-select-input-option-text-color-default)] outline-none select-none',
        'data-[highlighted]:bg-[var(--component-select-input-option-background-color-highlighted)]',
        'data-[state=checked]:bg-[var(--component-select-input-option-background-color-selected)] data-[state=checked]:text-[color:var(--component-select-input-option-text-color-selected)]',
        'data-[state=checked]:data-[highlighted]:bg-[var(--component-select-input-option-background-color-selected)] data-[state=checked]:data-[highlighted]:text-[color:var(--component-select-input-option-text-color-selected)]',
        'data-[state=checked]:data-[highlighted]:hover:bg-[var(--component-select-input-option-background-color-highlighted)] data-[state=checked]:data-[highlighted]:hover:text-[color:var(--component-select-input-option-text-color-default)]',
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="ml-auto flex shrink-0">
        <Checkmark
          aria-hidden
          className="size-[var(--density-sizing-dynamic-xx-large)]"
        />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}
SelectInputOption.displayName = 'SelectInput.Option';

export const SelectInput = {
  Root: SelectInputRoot,
  Label,
  Trigger: SelectInputTrigger,
  Content: SelectInputContent,
  Option: SelectInputOption,
  Microcopy,
};
