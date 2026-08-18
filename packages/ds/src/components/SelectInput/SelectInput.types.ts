import type { ComponentProps } from 'react';
import { Select as SelectPrimitive } from 'radix-ui';

export interface SelectInputRootProps extends ComponentProps<
  typeof SelectPrimitive.Root
> {
  className?: string;
  density?: 'roomy' | 'condensed';
}

export interface SelectInputTriggerProps extends ComponentProps<
  typeof SelectPrimitive.Trigger
> {
  error?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  density?: 'roomy' | 'condensed';
}

export interface SelectInputContentProps extends ComponentProps<
  typeof SelectPrimitive.Content
> {
  density?: 'roomy' | 'condensed';
}

export interface SelectInputOptionProps extends ComponentProps<
  typeof SelectPrimitive.Item
> {}
