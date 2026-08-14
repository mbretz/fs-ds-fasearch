import type { ComponentProps } from 'react';
import type { Avatar as AvatarPrimitive } from 'radix-ui';

/**
 * Figma "Size" variant (X-small…XX-large), translated per the size-scale
 * table in docs/PLAN.md §1.2.
 */
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/** Figma "User" variant: Associate (person, circular) / Entity (org, rounded-square). */
export type AvatarVariant = 'associate' | 'entity';

export interface AvatarRootProps extends ComponentProps<
  typeof AvatarPrimitive.Root
> {
  size?: AvatarSize;
  variant?: AvatarVariant;
}

export type AvatarImageProps = ComponentProps<typeof AvatarPrimitive.Image>;

export type AvatarFallbackProps = ComponentProps<
  typeof AvatarPrimitive.Fallback
>;
