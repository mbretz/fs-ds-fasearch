import { Avatar as AvatarPrimitive } from 'radix-ui';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import type {
  AvatarRootProps,
  AvatarImageProps,
  AvatarFallbackProps,
} from './Avatar.types';

/**
 * Avatar's six sizes are a fixed step scale, not derived from
 * --density-* vars (unlike Button's sm/md/lg) — see docs/PLAN.md §1.4/§1.6.
 * There is deliberately no `density` prop here.
 */
export const avatarRootVariants = cva(
  'inline-flex shrink-0 overflow-hidden bg-[var(--component-avatar-background-color)]',
  {
    variants: {
      size: {
        xs: 'size-[var(--component-avatar-size-x-small)] text-[length:var(--component-avatar-font-size-x-small)] [--avatar-icon-size:calc(var(--component-avatar-size-x-small)*0.6)]',
        sm: 'size-[var(--component-avatar-size-small)] text-[length:var(--component-avatar-font-size-small)] [--avatar-icon-size:calc(var(--component-avatar-size-small)*0.6)]',
        md: 'size-[var(--component-avatar-size-default)] text-[length:var(--component-avatar-font-size-default)] [--avatar-icon-size:calc(var(--component-avatar-size-default)*0.6)]',
        lg: 'size-[var(--component-avatar-size-large)] text-[length:var(--component-avatar-font-size-large)] [--avatar-icon-size:calc(var(--component-avatar-size-large)*0.6)]',
        xl: 'size-[var(--component-avatar-size-x-large)] text-[length:var(--component-avatar-font-size-x-large)] [--avatar-icon-size:calc(var(--component-avatar-size-x-large)*0.6)]',
        '2xl':
          'size-[var(--component-avatar-size-xx-large)] text-[length:var(--component-avatar-font-size-xx-large)] [--avatar-icon-size:calc(var(--component-avatar-size-xx-large)*0.6)]',
      },
      variant: {
        associate: 'rounded-[var(--component-avatar-border-radius-associate)]',
        entity: 'rounded-[var(--component-avatar-border-radius-entity)]',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'associate',
    },
  },
);

function AvatarRoot({
  className,
  size,
  variant,
  ref,
  ...props
}: AvatarRootProps) {
  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(avatarRootVariants({ size, variant }), className)}
      {...props}
    />
  );
}
AvatarRoot.displayName = 'Avatar.Root';

function AvatarImage({ className, ref, ...props }: AvatarImageProps) {
  return (
    <AvatarPrimitive.Image
      ref={ref}
      className={cn('size-full object-cover', className)}
      {...props}
    />
  );
}
AvatarImage.displayName = 'Avatar.Image';

/**
 * Renders initials text or a fallback icon (packages/icons, e.g. `Avatar`
 * for associate / `BuildingGeneric` for entity) — consumer supplies
 * children; Radix swaps to this automatically when Image errors, is
 * missing, or is still loading past `delayMs`. Icons should be sized via
 * the `--avatar-icon-size` var set on Avatar.Root (matches Figma's
 * observed ~60% icon-to-box ratio, e.g. `size-[var(--avatar-icon-size)]`).
 */
function AvatarFallback({ className, ref, ...props }: AvatarFallbackProps) {
  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        'flex size-full items-center justify-center uppercase text-[var(--semantic-content-common-text-color-default)]',
        className,
      )}
      {...props}
    />
  );
}
AvatarFallback.displayName = 'Avatar.Fallback';

export const Avatar = {
  Root: AvatarRoot,
  Image: AvatarImage,
  Fallback: AvatarFallback,
};
