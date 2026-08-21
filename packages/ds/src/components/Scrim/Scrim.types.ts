import type { ComponentProps } from 'react';

export interface ScrimProps extends ComponentProps<'div'> {
  /** Renders onto a consumer-supplied element (e.g. Radix's own Overlay) instead of a <div>. */
  asChild?: boolean;
}
