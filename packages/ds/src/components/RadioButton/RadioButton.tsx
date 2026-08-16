import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import type { RadioButtonProps } from './RadioButton.types';

/**
 * Data-attribute-driven (`peer-data-[disabled]`), not a JS `disabled` prop
 * variant — disabling can happen at the individual item OR at
 * `RadioGroup.Root` itself (e.g. a whole group locked by some other form
 * condition), and Radix propagates `data-disabled` to each Item's rendered
 * DOM either way. A JS-computed variant keyed only off this component's own
 * `disabled` prop would miss the Root-disabled case entirely, since a
 * consumer disabling the whole group wouldn't repeat `disabled` on every
 * item.
 */
export const radioButtonLabelVariants = cva(
  'text-[length:var(--component-radio-label-font-size)] font-[number:var(--component-radio-label-font-weight)] text-[color:var(--component-radio-label-text-color-default)] peer-data-[disabled]:text-[color:var(--component-radio-label-text-color-disabled)]',
);

/**
 * Figma's `Radio Button` (116:1128) has no `State=Error` variant at all
 * (confirmed via re-fetch — only `Checked`/`Disabled`) unlike Checkbox,
 * which does — so there's no `error` prop here.
 *
 * Whether the ring is "checked-blue" is runtime state Radix tracks
 * internally (via `RadioGroup.Root`'s own value), not something this
 * component receives as a prop — so it's driven entirely by Radix's
 * `data-state` attribute rather than a JS-computed cva variant, same
 * `data-[state=checked]` precedent as SelectInput.Option. Disabled must
 * win over checked (Figma's Checked+Disabled and Unchecked+Disabled share
 * one gray) without `!important`: pairing `data-disabled` with each
 * `data-state` value gives the disabled rule a strictly higher-specificity,
 * always-true extra condition, the same technique documented in
 * docs/PLAN.md's SelectInput note.
 */
export const radioButtonInputVariants = cva(
  'peer flex size-[var(--component-radio-size)] shrink-0 items-center justify-center rounded-full border-[length:var(--component-radio-border-width)] border-[color:var(--component-radio-border-color-inactive)] bg-[var(--component-radio-background-color-default)] data-[state=checked]:border-[color:var(--component-radio-border-color-active)] data-[disabled]:bg-[var(--component-radio-background-color-disabled)] data-[disabled]:data-[state=checked]:border-[color:var(--component-radio-border-color-disabled)] data-[disabled]:data-[state=unchecked]:border-[color:var(--component-radio-border-color-disabled)]',
);

const radioButtonIndicatorClassName =
  'size-[var(--component-radio-indicator-size)] rounded-full bg-[var(--component-radio-indicator-active)] data-[disabled]:bg-[var(--component-radio-indicator-disabled)]';

/**
 * The whole row is a native `<label>`, same whole-row-clickable precedent
 * as Checkbox. No `density` prop — Figma's `Radio Button` component set
 * defines only one size, same reasoning as Checkbox/Avatar.
 */
function RadioButton({
  className,
  disabled,
  value,
  children,
  ref,
  ...props
}: RadioButtonProps) {
  return (
    <label
      className={cn(
        'inline-flex min-h-[var(--component-radio-min-height)] cursor-pointer items-center justify-center gap-[var(--component-radio-gap)] px-[var(--component-radio-padding-inline)] py-[var(--component-radio-padding-block)] has-[[data-disabled]]:cursor-not-allowed',
        className,
      )}
    >
      <RadioGroupPrimitive.Item
        ref={ref}
        value={value}
        disabled={disabled}
        className={radioButtonInputVariants()}
        {...props}
      >
        <RadioGroupPrimitive.Indicator
          className={radioButtonIndicatorClassName}
        />
      </RadioGroupPrimitive.Item>
      {children && (
        <span className={radioButtonLabelVariants()}>{children}</span>
      )}
    </label>
  );
}
RadioButton.displayName = 'RadioButton';

export { RadioButton };
