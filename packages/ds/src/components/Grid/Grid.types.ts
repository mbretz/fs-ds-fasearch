import type { BoxProps } from '../Box/Box.types';

export interface GridProps extends BoxProps {
  /** Number of equal-width columns (`repeat(columns, minmax(0, 1fr))`). Omit to lay out columns via `className`/`style` instead. */
  columns?: number;
  gap?: BoxProps['padding'];
  columnGap?: BoxProps['padding'];
  rowGap?: BoxProps['padding'];
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'stretch';
}
