import type { BoxProps } from '../Box/Box.types';

export interface StackProps extends BoxProps {
  direction?: 'row' | 'column';
  gap?: BoxProps['padding'];
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
}
