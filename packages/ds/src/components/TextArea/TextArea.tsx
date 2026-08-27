import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { Label } from '../Label/Label';
import { Microcopy } from '../Microcopy/Microcopy';
import type { TextAreaRootProps, TextAreaFieldProps } from './TextArea.types';

export const textAreaFieldVariants = cva(
  'flex min-h-[var(--component-text-area-min-height)] items-start rounded-[var(--component-text-area-border-radius)] border-[length:var(--component-text-area-border-width)] border-[color:var(--component-text-area-border-color-default)] bg-[var(--component-text-area-background-color-default)] pt-[var(--density-spacing-dynamic-x-small)] pr-[var(--density-spacing-dynamic-x-small)] pb-[var(--density-spacing-dynamic-x-small)] pl-[var(--density-spacing-dynamic-x-small)] focus-within:border-[color:var(--component-text-area-border-color-active)] focus-within:shadow-[inset_0_0_0_calc(var(--semantic-control-border-width-active)-var(--component-text-area-border-width))_var(--component-text-area-border-color-active)]',
  {
    variants: {
      state: {
        default: '',
        error:
          'border-[color:var(--component-text-area-border-color-error)] bg-[var(--component-text-area-background-color-error)]',
        disabled:
          'border-[color:var(--component-text-area-border-color-disabled)] bg-[var(--component-text-area-background-color-disabled)]',
        'read-only': 'border-transparent pl-0',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  },
);

function TextAreaRoot({
  className,
  density,
  ref,
  ...props
}: TextAreaRootProps) {
  return (
    <div
      ref={ref}
      data-density={density}
      className={cn('flex flex-col', className)}
      {...props}
    />
  );
}
TextAreaRoot.displayName = 'TextArea.Root';

function TextAreaField({
  className,
  error = false,
  density,
  disabled,
  readOnly,
  ref,
  ...props
}: TextAreaFieldProps) {
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
      className={cn(textAreaFieldVariants({ state }), className)}
    >
      <textarea
        ref={ref}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={error || undefined}
        aria-required={props.required || undefined}
        className={cn(
          'min-w-0 flex-1 resize-y self-stretch border-0 bg-transparent pr-[var(--component-text-area-input-value-padding-inline)] py-[var(--component-text-area-input-value-padding-block)] text-[length:var(--component-text-area-input-value-font-size)] font-[number:var(--component-text-area-input-value-font-weight)] leading-[var(--component-text-area-input-value-line-height)] outline-none',
          state === 'read-only'
            ? 'pl-0'
            : 'pl-[var(--component-text-area-input-value-padding-inline)]',
          disabled
            ? 'text-[color:var(--component-text-area-input-value-text-color-disabled)]'
            : 'text-[color:var(--component-text-area-input-value-text-color-default)]',
        )}
        {...props}
      />
    </div>
  );
}
TextAreaField.displayName = 'TextArea.Field';

export const TextArea = {
  Root: TextAreaRoot,
  Label,
  Field: TextAreaField,
  Microcopy,
};
