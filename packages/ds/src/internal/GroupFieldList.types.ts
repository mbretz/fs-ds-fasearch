import type { ComponentProps } from 'react';

export interface GroupFieldListProps extends ComponentProps<'div'> {
  density?: 'roomy' | 'condensed';
  orientation?: 'vertical' | 'horizontal';
  error?: boolean;
}
