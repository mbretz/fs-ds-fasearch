import { Slot } from 'radix-ui';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import type { TagRootProps, TagLabelProps, TagProps } from './Tag.types';

// borderWidth's `heavy` step uses the same fixed-border/inset-shadow trick
// as Button's focus ring and Tabs' active border: the real border stays at
// --component-tag-border-width and a calc'd inset shadow supplies the extra
// visual width, so height never moves. The shadow color has to match
// whichever `variant` is active, hence the variant×borderWidth
// compoundVariants below rather than a single static class per step.
export const tagRootVariants = cva(
  'inline-flex w-fit shrink-0 items-center justify-center gap-[var(--component-tag-gap)] rounded-[var(--component-tag-border-radius)] border-[length:var(--component-tag-border-width)] text-[length:var(--component-tag-font-size)] leading-[length:var(--component-tag-line-height)] font-[number:var(--component-tag-font-weight)]',
  {
    variants: {
      variant: {
        generic:
          'border-[color:var(--component-tag-border-color-generic)] bg-[var(--component-tag-background-color-generic)] text-[color:var(--component-tag-text-color-default)]',
        teal: 'border-[color:var(--component-tag-border-color-teal)] bg-[var(--component-tag-background-color-teal)] text-[color:var(--component-tag-text-color-default)]',
        red: 'border-[color:var(--component-tag-border-color-red)] bg-[var(--component-tag-background-color-red)] text-[color:var(--component-tag-text-color-default)]',
        gold: 'border-[color:var(--component-tag-border-color-gold)] bg-[var(--component-tag-background-color-gold)] text-[color:var(--component-tag-text-color-default)]',
      },
      size: {
        lg: 'min-h-[var(--component-tag-min-height-large)] px-[var(--component-tag-padding-inline-large)] py-[calc(var(--component-tag-padding-block-large)-var(--component-tag-border-width))]',
        sm: 'min-h-[var(--component-tag-min-height-small)] px-[var(--component-tag-padding-inline-small)] py-[calc(var(--component-tag-padding-block-small)-var(--component-tag-border-width))]',
      },
      borderWidth: {
        default: 'shadow-none',
        heavy: '',
      },
    },
    // Each className below must stay a literal string, not built from a
    // template/variable — Tailwind's build-time scanner only discovers
    // arbitrary-value classes it can see as-is in the source text.
    compoundVariants: [
      {
        variant: 'generic',
        borderWidth: 'heavy',
        className:
          'shadow-[inset_0_0_0_calc(var(--semantic-control-border-width-heavy)-var(--component-tag-border-width))_var(--component-tag-border-color-generic)]',
      },
      {
        variant: 'teal',
        borderWidth: 'heavy',
        className:
          'shadow-[inset_0_0_0_calc(var(--semantic-control-border-width-heavy)-var(--component-tag-border-width))_var(--component-tag-border-color-teal)]',
      },
      {
        variant: 'red',
        borderWidth: 'heavy',
        className:
          'shadow-[inset_0_0_0_calc(var(--semantic-control-border-width-heavy)-var(--component-tag-border-width))_var(--component-tag-border-color-red)]',
      },
      {
        variant: 'gold',
        borderWidth: 'heavy',
        className:
          'shadow-[inset_0_0_0_calc(var(--semantic-control-border-width-heavy)-var(--component-tag-border-width))_var(--component-tag-border-color-gold)]',
      },
    ],
    defaultVariants: {
      variant: 'generic',
      size: 'lg',
      borderWidth: 'default',
    },
  },
);

function TagRoot({
  className,
  variant,
  size,
  borderWidth,
  asChild,
  ref,
  ...props
}: TagRootProps) {
  const Comp = asChild ? Slot.Root : 'span';
  return (
    <Comp
      ref={ref}
      className={cn(tagRootVariants({ variant, size, borderWidth }), className)}
      {...props}
    />
  );
}
TagRoot.displayName = 'Tag.Root';

function TagLabel({ className, ref, ...props }: TagLabelProps) {
  return <span ref={ref} className={cn('min-w-0', className)} {...props} />;
}
TagLabel.displayName = 'Tag.Label';

function Tag({ children, ...props }: TagProps) {
  return (
    <TagRoot {...props}>
      <TagLabel>{children}</TagLabel>
    </TagRoot>
  );
}
Tag.displayName = 'Tag';
Tag.Root = TagRoot;
Tag.Label = TagLabel;

export { Tag };
