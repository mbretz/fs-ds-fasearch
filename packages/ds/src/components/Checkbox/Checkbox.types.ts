import type { ComponentProps, ReactNode } from 'react';
import type { Checkbox as CheckboxPrimitive } from 'radix-ui';

/**
 * Figma `Checkbox` (90:686) `Selection` variant: `Default` | `Indeterminate`.
 * Radix's own `checked` prop already models this as `boolean | 'indeterminate'`
 * rather than a separate axis, so `selection` isn't its own prop here — a
 * consumer passes `checked="indeterminate"` directly.
 */
export interface CheckboxProps
  extends Omit<ComponentProps<typeof CheckboxPrimitive.Root>, 'children'> {
  /** Figma "Checkbox Label" — the row's own label text, not a separate <label>. */
  children?: ReactNode;
  /**
   * Figma `Checkbox` `State=Error` (90:714) — only recolors the label text,
   * never the box itself. Independent of a parent ChecklistGroup's own
   * error state; a single item can error on its own.
   */
  error?: boolean;
}
