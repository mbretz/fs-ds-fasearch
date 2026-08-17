import type { ComponentProps } from 'react';

export interface LinkNavigationProps extends ComponentProps<'a'> {
  direction: 'previous' | 'next';
  /** Flex alignment of the chevron against the link text (a flex sibling, not inline content — see Link's iconVerticalAlign for the inline case). */
  iconAlign?: 'start' | 'center' | 'end';
  asChild?: boolean;
}
