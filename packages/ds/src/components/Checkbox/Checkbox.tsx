import { Checkbox as CheckboxPrimitive } from 'radix-ui';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import type { CheckboxProps } from './Checkbox.types';

/**
 * Checkbox's own text color is independent of ChecklistGroup's error state —
 * Figma's `Checkbox` `State=Error` (90:714) only recolors this label, never
 * the box (see CheckboxInput below), and a single item can error on its own.
 */
export const checkboxLabelVariants = cva(
  'text-[length:var(--component-checkbox-input-value-font-size)] font-[number:var(--component-checkbox-input-value-font-weight)]',
  {
    variants: {
      state: {
        default:
          'text-[color:var(--component-checkbox-text-color-default)]',
        error: 'text-[color:var(--component-checkbox-text-color-error)]',
        disabled:
          'text-[color:var(--component-checkbox-text-color-disabled)]',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  },
);

/**
 * Checked/indeterminate box color is identical (`#006DA3`, both driven by
 * `--component-checkbox-selected-color`) — Figma's Indeterminate variant
 * reuses the exact same fill/stroke as Checked, only the inner glyph
 * (checkmark vs. dash) differs. Disabled overrides both to the same gray
 * regardless of checked state, matching the Figma `Disabled=True` variants.
 */
export const checkboxInputVariants = cva(
  'flex size-[var(--component-checkbox-size)] shrink-0 items-center justify-center rounded-[var(--component-checkbox-border-radius)] border-[length:var(--component-checkbox-border-width)]',
  {
    variants: {
      state: {
        unchecked:
          'border-[color:var(--component-checkbox-border-color)] bg-[var(--component-checkbox-background-color-default)]',
        checked:
          'border-[color:var(--component-checkbox-selected-color)] bg-[var(--component-checkbox-background-color-selected)] text-[color:var(--component-checkbox-checkmark-selected)]',
        disabled:
          'border-[color:var(--component-checkbox-background-color-disabled)] bg-[var(--component-checkbox-background-color-disabled)] text-[color:var(--component-checkbox-checkmark-disabled)]',
      },
    },
    defaultVariants: {
      state: 'unchecked',
    },
  },
);

/** Figma's custom checkmark glyph (confirmed via image re-fetch of 89:658) — not a `packages/icons` reference, same "intentionally inline SVG" precedent as the audit doc's Checkbox note. */
function CheckGlyph() {
  return (
    <svg
      aria-hidden
      data-testid="checkbox-check-glyph"
      viewBox="0 0 24 24"
      fill="none"
      className="size-full"
    >
      <path
        d="M4.8 13.674 7.739 17.85c.24.342.612.547 1.01.558.4.012.783-.169 1.038-.495L19.2 6"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Figma's custom indeterminate dash glyph (confirmed via image re-fetch of 89:668). */
function IndeterminateGlyph() {
  return (
    <svg
      aria-hidden
      data-testid="checkbox-indeterminate-glyph"
      viewBox="0 0 24 24"
      fill="none"
      className="size-full"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.3636 10.9091C17.2674 10.9091 18 11.6417 18 12.5454C18 13.396 17.351 14.095 16.5212 14.1743L16.3636 14.1818H7.63636C6.73262 14.1818 6 13.4492 6 12.5454C6 11.6948 6.64897 10.9958 7.47877 10.9165L7.63636 10.9091H16.3636Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * The whole row is a native `<label>` (Figma's Checkbox padding/height apply
 * to the full row, not just the box) — `<label>` wrapping a labelable
 * control natively forwards clicks/keyboard activation to it, so no
 * `htmlFor`/`id` pairing is needed. No `density` prop: Figma's `Checkbox`
 * component set (90:686) defines only one size, unlike TextInput/SelectInput
 * which have real density-scaled variants.
 */
function Checkbox({
  className,
  error = false,
  disabled,
  checked,
  children,
  ref,
  ...props
}: CheckboxProps) {
  const labelState = disabled ? 'disabled' : error ? 'error' : 'default';
  const inputState = disabled
    ? 'disabled'
    : checked
      ? 'checked'
      : 'unchecked';

  return (
    <label
      className={cn(
        'inline-flex min-h-[var(--component-checkbox-min-height)] items-center justify-center gap-[var(--component-checkbox-gap)] px-[var(--component-checkbox-padding-inline)] py-[var(--component-checkbox-padding-block)]',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className,
      )}
    >
      <CheckboxPrimitive.Root
        ref={ref}
        checked={checked}
        disabled={disabled}
        className={checkboxInputVariants({ state: inputState })}
        {...props}
      >
        <CheckboxPrimitive.Indicator className="size-full">
          {checked === 'indeterminate' ? <IndeterminateGlyph /> : <CheckGlyph />}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {children && (
        <span className={checkboxLabelVariants({ state: labelState })}>
          {children}
        </span>
      )}
    </label>
  );
}
Checkbox.displayName = 'Checkbox';

export { Checkbox };
