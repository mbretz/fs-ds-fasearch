import type { ComponentProps } from 'react';

export interface MicrocopyProps extends ComponentProps<'p'> {
  error?: boolean;
}
