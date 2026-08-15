import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { Label } from '../Label/Label';
import { Microcopy } from '../Microcopy/Microcopy';
import type { TextInputRootProps, TextInputFieldProps } from './TextInput.types';

/**
 * Confirmed via a direct re-fetch of the Figma "TextInput" component set
 * (122:1502, Error state 122:1503): the outer column frame reports no
 * `gap` at all between Label/Field/Microcopy — each part's own
 * line-height/padding already provides the vertical rhythm, so Root
 * intentionally adds no gap utility rather than guessing a value.
 */
function TextInputRoot({
  className,
  density,
  ref,
  ...props
}: TextInputRootProps) {
  return (
    <div
      ref={ref}
      data-density={density}
      className={cn('flex flex-col', className)}
      {...props}
    />
  );
}
TextInputRoot.displayName = 'TextInput.Root';

/**
 * Base styles use the `default` state; `state` variants override
 * border/background/text-color as a set (never combined — Figma has no
 * Disabled+Error or Disabled+Read-Only variant to combine toward).
 * `read-only` matches Figma's Read-Only Input (121:1383): border and
 * background both collapse to transparent/default and the inline-start
 * padding drops to 0 (Figma's authored padding is literally
 * "12px 16px 12px 0px").
 *
 * Focus (Figma's "Active" state, 121:1355) is a 4px border in Figma, but
 * `border-width` itself never changes here — only `border-[length:...]`
 * did that in an earlier draft, and growing the real border ate into the
 * content box even under `box-sizing: border-box`, nudging the icon/text
 * inward on focus. Instead the border stays fixed at the default 1px and
 * an inset `box-shadow` (sized to the gap between the active and default
 * border widths, so it's still token-derived rather than a hardcoded
 * "3px") adds the extra visual weight without touching layout at all.
 *
 * `h-[...small-min-height]`, not `min-h-*`: the padding-block + the new
 * density-aware input-value line-height (see docs/PLAN.md §1.6's
 * TextInput note) already sum to exactly this token's value in both
 * densities, so nothing should ever need to grow past it. `min-height`
 * still left the box vulnerable to overshooting from browser-specific
 * inline "strut" sizing (the flex row's own inherited line-height,
 * independent of any child's actual content box) — confirmed by
 * measuring 50px/37px instead of 48px/32px in a live render. A fixed
 * `height` on the flex container is a hard target that overflow can't
 * push past, closing that gap.
 */
export const textInputFieldVariants = cva(
  'flex h-[var(--density-control-input-small-min-height)] items-center gap-[var(--density-spacing-dynamic-large)] rounded-[var(--component-text-input-border-radius)] border-[length:var(--component-text-input-border-width)] border-[color:var(--component-text-input-border-color-default)] bg-[var(--component-text-input-background-color-default)] px-[var(--density-control-input-padding-inline)] py-[var(--density-control-input-padding-block)] focus-within:border-[color:var(--component-text-input-border-color-active)] focus-within:shadow-[inset_0_0_0_calc(var(--semantic-control-border-width-active)-var(--component-text-input-border-width))_var(--component-text-input-border-color-active)]',
  {
    variants: {
      state: {
        default: '',
        error:
          'border-[color:var(--component-text-input-border-color-error)] bg-[var(--component-text-input-background-color-error)]',
        disabled:
          'border-[color:var(--component-text-input-border-color-disabled)] bg-[var(--component-text-input-background-color-disabled)]',
        'read-only': 'border-transparent pl-0',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  },
);

function TextInputField({
  className,
  error = false,
  iconStart,
  iconEnd,
  density,
  disabled,
  readOnly,
  ref,
  ...props
}: TextInputFieldProps) {
  const state = disabled
    ? 'disabled'
    : error
      ? 'error'
      : readOnly
        ? 'read-only'
        : 'default';

  return (
    <div
      data-density={density}
      className={cn(textInputFieldVariants({ state }), className)}
    >
      {iconStart && (
        <span
          aria-hidden
          className="flex size-[var(--density-sizing-dynamic-xx-large)] shrink-0 items-center justify-center leading-none"
        >
          {iconStart}
        </span>
      )}
      <input
        ref={ref}
        disabled={disabled}
        readOnly={readOnly}
        className={cn(
          'min-w-0 flex-1 border-0 bg-transparent text-[length:var(--component-text-input-input-value-font-size)] font-[number:var(--component-text-input-input-value-font-weight)] leading-[var(--component-text-input-input-value-line-height)] outline-none',
          disabled
            ? 'text-[color:var(--component-text-input-text-color-disabled)]'
            : 'text-[color:var(--component-text-input-text-color-default)]',
        )}
        {...props}
      />
      {iconEnd && (
        <span
          aria-hidden
          className="flex size-[var(--density-sizing-dynamic-xx-large)] shrink-0 items-center justify-center leading-none"
        >
          {iconEnd}
        </span>
      )}
    </div>
  );
}
TextInputField.displayName = 'TextInput.Field';

/**
 * TextInput.Label and TextInput.Microcopy are the standalone Label and
 * Microcopy components, not separate implementations — Figma's
 * TextInput compound (122:1502) nests a real "Input Label" instance
 * (88:596) and a Microcopy text run that shares Label's exact 14px/400
 * default style and error red, so both are already fully covered by
 * the shared primitives.
 */
export const TextInput = {
  Root: TextInputRoot,
  Label,
  Field: TextInputField,
  Microcopy,
};
