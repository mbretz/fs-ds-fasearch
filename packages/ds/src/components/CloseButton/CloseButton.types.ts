import type { ComponentProps } from 'react';

// Local override of the shared AriaLabelProp convention (docs/PLAN.md
// §1.6) — this component's scenario warrants its own wording.
type CloseButtonAriaLabelProp = {
  /**
   * Overrides the default "Close" accessible name. Set this when there
   * are multiple dismissible things on one page (e.g. "Dismiss
   * notification") so screen-reader users can tell them apart.
   */
  'aria-label'?: string;
};

// Explicit allow-list, not Omit<ButtonProps, ...>: Close Button (110:717)
// has no variation axis in Figma at all, so the contract should name
// exactly what's allowed to vary (behavior/identity) rather than
// inheriting Button's full prop surface minus a deny-list, which would
// silently re-expose any new visual prop Button gains later.
export interface CloseButtonProps
  extends
    Pick<
      ComponentProps<'button'>,
      'onClick' | 'disabled' | 'className' | 'id' | 'ref'
    >,
    CloseButtonAriaLabelProp {}
