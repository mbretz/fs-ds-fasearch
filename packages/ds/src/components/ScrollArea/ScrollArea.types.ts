import type { ComponentProps, ReactNode } from 'react';
import type { ScrollArea as ScrollAreaPrimitive } from 'radix-ui';

export interface ScrollAreaRootProps extends ComponentProps<
  typeof ScrollAreaPrimitive.Root
> {
  density?: 'roomy' | 'condensed';
}

export type ScrollAreaViewportProps = ComponentProps<
  typeof ScrollAreaPrimitive.Viewport
>;

export type ScrollAreaScrollbarProps = ComponentProps<
  typeof ScrollAreaPrimitive.Scrollbar
>;

export type ScrollAreaThumbProps = ComponentProps<
  typeof ScrollAreaPrimitive.Thumb
>;

export type ScrollAreaCornerProps = ComponentProps<
  typeof ScrollAreaPrimitive.Corner
>;

export interface ScrollAreaProps extends Omit<ScrollAreaRootProps, 'children'> {
  children?: ReactNode;
  /** Renders a horizontal scrollbar in addition to the default vertical one. */
  horizontal?: boolean;
  viewportClassName?: string;
}
