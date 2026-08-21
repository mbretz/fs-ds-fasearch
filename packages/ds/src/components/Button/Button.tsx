import { Slot } from 'radix-ui';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import type {
  ButtonRootProps,
  ButtonIconProps,
  ButtonLabelProps,
  ButtonProps,
} from './Button.types';

// Fill variants (primary): background/border track the same var so both
// always match, per Figma (border color never diverges from the fill).
export const buttonRootVariants = cva(
  'inline-flex min-h-[var(--component-button-min-height)] shrink-0 items-center justify-center gap-[var(--component-button-gap)] rounded-[var(--component-button-border-radius)] border-[length:var(--component-button-border-width)] text-[length:var(--component-button-font-size)] leading-[length:var(--component-button-line-height)] font-[number:var(--component-button-font-weight)] outline-none disabled:cursor-not-allowed disabled:border-disabled-subtle disabled:bg-disabled-subtle disabled:text-disabled-text',
  {
    variants: {
      iconOnly: {
        false:
          'min-w-[var(--component-button-min-width)] px-[var(--component-button-padding-inline)] py-[calc(var(--component-button-padding-block)-var(--component-button-border-width))]',
        true: 'h-[var(--component-button-min-height)] w-[var(--component-button-min-height)] px-0 py-0',
      },
      variant: {
        primary:
          'border-[color:var(--component-button-background-color-primary-default)] bg-[var(--component-button-background-color-primary-default)] text-[color:var(--component-button-text-color-primary-default)] hover:border-[color:var(--component-button-background-color-primary-hover)] hover:bg-[var(--component-button-background-color-primary-hover)] focus-visible:shadow-[inset_0_0_0_calc(var(--semantic-control-border-width-active)-var(--component-button-border-width))_var(--component-button-background-color-primary-hover)]',
        secondary:
          'border-[color:var(--component-button-border-color-secondary)] bg-[var(--component-button-background-color-secondary-default)] text-[color:var(--component-button-text-color-secondary-default)] hover:bg-[var(--component-button-background-color-secondary-hover)] hover:text-[color:var(--component-button-text-color-secondary-hover)] focus-visible:shadow-[inset_0_0_0_calc(var(--semantic-control-border-width-active)-var(--component-button-border-width))_var(--component-button-border-color-secondary)]',
        tertiary:
          'border-transparent bg-[var(--component-button-background-color-tertiary-default)] text-[color:var(--component-button-text-color-tertiary-default)] hover:bg-[var(--component-button-background-color-tertiary-hover)] hover:text-[color:var(--component-button-text-color-tertiary-hover)] focus-visible:shadow-[inset_0_0_0_var(--semantic-control-border-width-active)_var(--component-button-text-color-tertiary-default)]',
      },
      destructive: {
        false: '',
        true: '',
      },
    },
    compoundVariants: [
      {
        variant: 'primary',
        destructive: true,
        className:
          'border-[color:var(--component-button-background-color-destructive-default)] bg-[var(--component-button-background-color-destructive-default)] text-critical-on hover:border-[color:var(--component-button-background-color-destructive-hover)] hover:bg-[var(--component-button-background-color-destructive-hover)] focus-visible:shadow-[inset_0_0_0_calc(var(--semantic-control-border-width-active)-var(--component-button-border-width))_var(--component-button-background-color-destructive-hover)]',
      },
      {
        variant: 'secondary',
        destructive: true,
        className:
          'border-critical bg-[var(--component-button-background-color-secondary-default)] text-critical hover:border-critical-strong hover:bg-critical-subtle hover:text-critical-strong focus-visible:shadow-[inset_0_0_0_calc(var(--semantic-control-border-width-active)-var(--component-button-border-width))_var(--color-critical)]',
      },
      {
        variant: 'tertiary',
        destructive: true,
        className:
          'bg-[var(--component-button-background-color-tertiary-default)] text-critical hover:bg-critical-subtle hover:text-critical-strong focus-visible:shadow-[inset_0_0_0_var(--semantic-control-border-width-active)_var(--color-critical)]',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      destructive: false,
      iconOnly: false,
    },
  },
);

function ButtonRoot({
  className,
  variant,
  destructive,
  iconOnly,
  density,
  asChild,
  ref,
  ...props
}: ButtonRootProps) {
  const Comp = asChild ? Slot.Root : 'button';
  return (
    <Comp
      ref={ref}
      data-density={density}
      className={cn(
        buttonRootVariants({ variant, destructive, iconOnly }),
        className,
      )}
      {...props}
    />
  );
}
ButtonRoot.displayName = 'Button.Root';

function ButtonIcon({ className, ref, ...props }: ButtonIconProps) {
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex size-[var(--density-sizing-dynamic-xx-large)] shrink-0 items-center justify-center [&>svg]:size-full',
        className,
      )}
      {...props}
    />
  );
}
ButtonIcon.displayName = 'Button.Icon';

function ButtonLabel({
  className,
  visuallyHidden,
  ref,
  ...props
}: ButtonLabelProps) {
  return (
    <span
      ref={ref}
      className={cn('min-w-0', visuallyHidden && 'sr-only', className)}
      {...props}
    />
  );
}
ButtonLabel.displayName = 'Button.Label';

function Button({
  children,
  showLabel = true,
  iconStart,
  iconEnd,
  ...props
}: ButtonProps) {
  return (
    <ButtonRoot iconOnly={!showLabel} {...props}>
      {iconStart && <ButtonIcon>{iconStart}</ButtonIcon>}
      <ButtonLabel visuallyHidden={!showLabel}>{children}</ButtonLabel>
      {iconEnd && <ButtonIcon>{iconEnd}</ButtonIcon>}
    </ButtonRoot>
  );
}
Button.displayName = 'Button';
Button.Root = ButtonRoot;
Button.Icon = ButtonIcon;
Button.Label = ButtonLabel;

export { Button };
