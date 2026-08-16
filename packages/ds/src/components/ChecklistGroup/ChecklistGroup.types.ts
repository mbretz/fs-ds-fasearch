import type { ComponentProps } from 'react';

export interface ChecklistGroupRootProps extends ComponentProps<'div'> {
  density?: 'roomy' | 'condensed';
}

/**
 * Figma `Checklist Group` (92:691) has no `Orientation` property (unlike
 * the sibling `Radio Group`, 111:926, which does) — only vertical stacking
 * is authored, so this doesn't take an `orientation` prop.
 */
export interface ChecklistGroupGroupProps extends ComponentProps<'div'> {
  density?: 'roomy' | 'condensed';
  error?: boolean;
}

/**
 * Figma `Checklist` (93:693) `Nested=True` variant — the 40px inline
 * indent that wraps a sub-group of Checkbox items under a parent Checkbox.
 * A plain structural wrapper, matching the composition-helper framing
 * Figma itself uses for this sub-component.
 */
export type ChecklistGroupNestedGroupProps = ComponentProps<'div'>;
