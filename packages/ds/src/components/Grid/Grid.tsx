import { Slot } from 'radix-ui';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { boxVariants } from '../Box/Box';
import type { GridProps } from './Grid.types';

export const gridVariants = cva('grid', {
  variants: {
    gap: {
      none: 'gap-0',
      'xx-small': 'gap-[var(--density-spacing-dynamic-xx-small)]',
      'x-small': 'gap-[var(--density-spacing-dynamic-x-small)]',
      small: 'gap-[var(--density-spacing-dynamic-small)]',
      med: 'gap-[var(--density-spacing-dynamic-med)]',
      large: 'gap-[var(--density-spacing-dynamic-large)]',
      'x-large': 'gap-[var(--density-spacing-dynamic-x-large)]',
      'xx-large': 'gap-[var(--density-spacing-dynamic-xx-large)]',
    },
    columnGap: {
      none: 'gap-x-0',
      'xx-small': 'gap-x-[var(--density-spacing-dynamic-xx-small)]',
      'x-small': 'gap-x-[var(--density-spacing-dynamic-x-small)]',
      small: 'gap-x-[var(--density-spacing-dynamic-small)]',
      med: 'gap-x-[var(--density-spacing-dynamic-med)]',
      large: 'gap-x-[var(--density-spacing-dynamic-large)]',
      'x-large': 'gap-x-[var(--density-spacing-dynamic-x-large)]',
      'xx-large': 'gap-x-[var(--density-spacing-dynamic-xx-large)]',
    },
    rowGap: {
      none: 'gap-y-0',
      'xx-small': 'gap-y-[var(--density-spacing-dynamic-xx-small)]',
      'x-small': 'gap-y-[var(--density-spacing-dynamic-x-small)]',
      small: 'gap-y-[var(--density-spacing-dynamic-small)]',
      med: 'gap-y-[var(--density-spacing-dynamic-med)]',
      large: 'gap-y-[var(--density-spacing-dynamic-large)]',
      'x-large': 'gap-y-[var(--density-spacing-dynamic-x-large)]',
      'xx-large': 'gap-y-[var(--density-spacing-dynamic-xx-large)]',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    },
    justify: {
      start: 'justify-items-start',
      center: 'justify-items-center',
      end: 'justify-items-end',
      stretch: 'justify-items-stretch',
    },
  },
  defaultVariants: {
    gap: 'none',
  },
});

// `columns` stays a plain inline style (not a cva step scale like
// Box/Stack's spacing props) because it's an open-ended track count, not a
// design token -- Tailwind's core grid-cols-1..12 utilities would cap
// consumers at 12 columns for no reason tied to the token system.
function Grid({
  className,
  asChild,
  padding,
  columns,
  gap,
  columnGap,
  rowGap,
  align,
  justify,
  style,
  ref,
  ...props
}: GridProps) {
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <Comp
      ref={ref}
      className={cn(
        boxVariants({ padding }),
        gridVariants({ gap, columnGap, rowGap, align, justify }),
        className,
      )}
      style={
        columns
          ? {
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              ...style,
            }
          : style
      }
      {...props}
    />
  );
}
Grid.displayName = 'Grid';

export { Grid };
