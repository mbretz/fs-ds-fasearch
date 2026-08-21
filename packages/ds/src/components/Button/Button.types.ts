import type { ComponentProps, ReactNode } from 'react';
import type { AriaLabelProp } from '../../utils/a11y-props';

// No `size` prop — Figma's Button (288:1360) has no `Size` variant.
// 'aria-label' is Omit'd from ComponentProps<'button'> so AriaLabelProp
// (see its own doc for why) is the only contributor of that key — two
// interfaces both declaring it would make the hover doc ambiguous.
export interface ButtonRootProps
  extends Omit<ComponentProps<'button'>, 'aria-label'>, AriaLabelProp {
  variant?: 'primary' | 'secondary' | 'tertiary';
  // Boolean, not part of `intent`: Figma's "Destructive" state draws from
  // `response.critical.*`, not `intent.*` (docs/FIGMA_COMPONENT_AUDIT.md).
  destructive?: boolean;
  density?: 'roomy' | 'condensed';
  asChild?: boolean;
  iconOnly?: boolean;
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
export interface ButtonProps extends Omit<ButtonRootProps, 'iconOnly'> {
  children: ReactNode;
  showLabel?: boolean;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
}
