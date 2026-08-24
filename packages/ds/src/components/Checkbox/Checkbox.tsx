import { Checkbox as CheckboxPrimitive } from 'radix-ui';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import type { CheckboxProps } from './Checkbox.types';

/**
 * Checkbox's own text color is independent of ChecklistGroup's error state —
 * Figma's `Checkbox` `State=Error` (90:714) only recolors this label, never
 * the box (see CheckboxInput below), and a single item can error on its own.
 * `disabled` is still a real, always-controlled prop (unlike `checked`,
 * there's no Radix "uncontrolled disabled" concept), so the label's
 * disabled color stays driven off the `peer`'s `data-disabled` attribute —
 * same reasoning, just consistent with the box below rather than the two
 * being styled two different ways.
 */
export const checkboxLabelVariants = cva(
  'text-[length:var(--component-checkbox-input-value-font-size)] font-[number:var(--component-checkbox-input-value-font-weight)] peer-data-[disabled]:text-[color:var(--component-checkbox-text-color-disabled)]',
  {
    variants: {
      state: {
        default: 'text-[color:var(--component-checkbox-text-color-default)]',
        error: 'text-[color:var(--component-checkbox-text-color-error)]',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  },
);

/**
 * Driven by Radix's own `data-state`/`data-disabled` attributes, not a
 * JS-computed `checked`/`disabled` prop variant — a JS variant only reflects
 * whatever `checked` value the consumer happens to pass in, so an
 * uncontrolled Checkbox (`defaultChecked`, no `checked`/`onCheckedChange`)
 * would toggle Radix's real internal state on click while this component's
 * own styling silently stayed frozen at its initial variant. Same
 * `data-[state=...]` precedent as RadioButton/Tabs/SegmentedControl
 * (docs/PLAN.md §1.6). Checked/indeterminate box color is identical
 * (`#006DA3`, both driven by `--component-checkbox-selected-color`) —
 * Figma's Indeterminate variant reuses the exact same fill/stroke as
 * Checked, only the inner glyph (checkmark vs. dash) differs. `data-disabled`
 * is paired with each `data-state` value (not a standalone `data-disabled:`
 * rule) so the disabled color always wins on real specificity rather than
 * relying on Tailwind's utility-generation order — same technique as
 * RadioButton's own disabled-beats-checked handling.
 */
export const checkboxInputVariants = cva(
  'peer group flex size-[var(--component-checkbox-size)] shrink-0 items-center justify-center rounded-[var(--component-checkbox-border-radius)] border-[length:var(--component-checkbox-border-width)] border-[color:var(--component-checkbox-border-color)] bg-[var(--component-checkbox-background-color-default)] data-[state=checked]:border-[color:var(--component-checkbox-selected-color)] data-[state=checked]:bg-[var(--component-checkbox-background-color-selected)] data-[state=checked]:text-[color:var(--component-checkbox-checkmark-selected)] data-[state=indeterminate]:border-[color:var(--component-checkbox-selected-color)] data-[state=indeterminate]:bg-[var(--component-checkbox-background-color-selected)] data-[state=indeterminate]:text-[color:var(--component-checkbox-checkmark-selected)] data-[disabled]:data-[state=unchecked]:border-[color:var(--component-checkbox-background-color-disabled)] data-[disabled]:data-[state=unchecked]:bg-[var(--component-checkbox-background-color-disabled)] data-[disabled]:data-[state=checked]:border-[color:var(--component-checkbox-background-color-disabled)] data-[disabled]:data-[state=checked]:bg-[var(--component-checkbox-background-color-disabled)] data-[disabled]:data-[state=checked]:text-[color:var(--component-checkbox-checkmark-disabled)] data-[disabled]:data-[state=indeterminate]:border-[color:var(--component-checkbox-background-color-disabled)] data-[disabled]:data-[state=indeterminate]:bg-[var(--component-checkbox-background-color-disabled)] data-[disabled]:data-[state=indeterminate]:text-[color:var(--component-checkbox-checkmark-disabled)]',
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
  const labelState = error ? 'error' : 'default';

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
        className={checkboxInputVariants()}
        {...props}
      >
        <CheckboxPrimitive.Indicator className="size-full">
          <span className="hidden size-full group-data-[state=checked]:block">
            <CheckGlyph />
          </span>
          <span className="hidden size-full group-data-[state=indeterminate]:block">
            <IndeterminateGlyph />
          </span>
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
