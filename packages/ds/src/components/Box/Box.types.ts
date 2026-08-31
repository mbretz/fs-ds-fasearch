import type { ComponentProps } from 'react';
import type { Spacing } from '../../utils/spacing-scale';

export interface BoxProps extends ComponentProps<'div'> {
  padding?: Spacing;
  asChild?: boolean;
}
