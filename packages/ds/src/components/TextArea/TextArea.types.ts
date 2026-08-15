import type { ComponentProps } from 'react';

export interface TextAreaRootProps extends ComponentProps<'div'> {
  density?: 'roomy' | 'condensed';
}

export interface TextAreaFieldProps
  extends Omit<ComponentProps<'textarea'>, 'size'> {
  error?: boolean;
  density?: 'roomy' | 'condensed';
}

export interface TextAreaMicrocopyProps extends ComponentProps<'p'> {
  error?: boolean;
}
