import { Slot } from 'radix-ui';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { boxVariants } from '../Box/Box';
import type { StackProps } from './Stack.types';

export const stackVariants = cva('flex', {
  variants: {
    direction: {
      row: 'flex-row',
      column: 'flex-col',
    },
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
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
    wrap: {
      true: 'flex-wrap',
      false: 'flex-nowrap',
    },
  },
  defaultVariants: {
    direction: 'column',
    gap: 'none',
  },
});

function Stack({
  className,
  asChild,
  padding,
  direction,
  gap,
  align,
  justify,
  wrap,
  ref,
  ...props
}: StackProps) {
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <Comp
      ref={ref}
      className={cn(
        boxVariants({ padding }),
        stackVariants({ direction, gap, align, justify, wrap }),
        className,
      )}
      {...props}
    />
  );
}
Stack.displayName = 'Stack';

export { Stack };
