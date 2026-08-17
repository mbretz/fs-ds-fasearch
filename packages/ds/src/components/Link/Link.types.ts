import type { ComponentProps } from 'react';

export interface LinkProps extends ComponentProps<'a'> {
  /** Figma's "New Window" — shows the trailing icon and sets target="_blank" rel="noopener noreferrer". */
  newWindow?: boolean;
  underline?: boolean;
  /** Vertical alignment of the trailing icon relative to wrapped multi-line text. */
  iconVerticalAlign?: 'start' | 'center' | 'end';
  asChild?: boolean;
}
