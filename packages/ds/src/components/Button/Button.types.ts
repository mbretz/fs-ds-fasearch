import type { ComponentProps, ReactNode } from 'react';

// No `size` prop — Figma's Button (288:1360) has no `Size` variant.
export interface ButtonRootProps extends ComponentProps<'button'> {
  variant?: 'primary' | 'secondary' | 'tertiary';
  // Boolean, not part of `intent`: Figma's "Destructive" state draws from
  // `response.critical.*`, not `intent.*` (docs/FIGMA_COMPONENT_AUDIT.md).
  destructive?: boolean;
  density?: 'roomy' | 'condensed';
  asChild?: boolean;
}

export type ButtonIconProps = ComponentProps<'span'>;

export interface ButtonLabelProps extends ComponentProps<'span'> {
  /** Visually hides the label without unmounting it (keeps it as the accessible name). */
  visuallyHidden?: boolean;
}

/**
 * Convenience wrapper composing Root/Icon/Label. `showLabel: false` is the
 * icon-only pattern — `children` stays mounted but visually hidden, so it's
 * still the default accessible name; `aria-label` overrides it when needed.
 */
export interface ButtonProps extends ButtonRootProps {
  children: ReactNode;
  showLabel?: boolean;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
}
