import type { ComponentProps, ReactNode } from 'react';
import type { RadioGroup as RadioGroupPrimitive } from 'radix-ui';

/**
 * Wraps Radix's `RadioGroup.Item`, not a standalone `Radio` primitive —
 * Radix has no ungrouped single-radio component, and Figma's own `Radio
 * Button` (116:1128) is always used nested inside `Radio Group`'s slot
 * (confirmed via re-fetch of 111:926), never standalone. Requires a
 * `RadioGroup.Root` ancestor (via this package's `RadioGroup.Root` once
 * built, or Radix's own directly) to function, same as native
 * `<input type="radio">` requires a shared `name` — see
 * RadioButton.stories.tsx for the minimum wrapping needed to render one in
 * isolation.
 */
export interface RadioButtonProps extends Omit<
  ComponentProps<typeof RadioGroupPrimitive.Item>,
  'children'
> {
  children?: ReactNode;
}
