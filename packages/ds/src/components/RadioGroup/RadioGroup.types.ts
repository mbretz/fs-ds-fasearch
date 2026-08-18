import type { ComponentProps } from 'react';
import type { RadioGroup as RadioGroupPrimitive } from 'radix-ui';

export interface RadioGroupRootProps extends ComponentProps<
  typeof RadioGroupPrimitive.Root
> {
  density?: 'roomy' | 'condensed';
}

export interface RadioGroupGroupProps extends ComponentProps<'div'> {
  density?: 'roomy' | 'condensed';
  error?: boolean;
  orientation?: 'vertical' | 'horizontal';
}
