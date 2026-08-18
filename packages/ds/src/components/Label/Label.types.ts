import type { ComponentProps } from 'react';
import type { Label as LabelPrimitive } from 'radix-ui';

/**
 * Figma "Input Label" (88:596) `Requirement` variant: `required` | `optional`
 * | `none`. `none` is expressed in code as the prop being omitted, so only
 * the two suffix-bearing states need a value.
 */
export type LabelRequirement = 'required' | 'optional';

export interface LabelProps extends ComponentProps<typeof LabelPrimitive.Root> {
  requirement?: LabelRequirement;
  error?: boolean;
}
