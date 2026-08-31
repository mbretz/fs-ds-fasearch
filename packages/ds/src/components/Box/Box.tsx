import { Slot } from 'radix-ui';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import type { BoxProps } from './Box.types';

export const boxVariants = cva('', {
  variants: {
    padding: {
      none: 'p-0',
      'xx-small': 'p-[var(--density-spacing-dynamic-xx-small)]',
      'x-small': 'p-[var(--density-spacing-dynamic-x-small)]',
      small: 'p-[var(--density-spacing-dynamic-small)]',
      med: 'p-[var(--density-spacing-dynamic-med)]',
      large: 'p-[var(--density-spacing-dynamic-large)]',
      'x-large': 'p-[var(--density-spacing-dynamic-x-large)]',
      'xx-large': 'p-[var(--density-spacing-dynamic-xx-large)]',
    },
  },
  defaultVariants: {
    padding: 'none',
  },
});

function Box({ className, asChild, padding, ref, ...props }: BoxProps) {
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <Comp
      ref={ref}
      className={cn(boxVariants({ padding }), className)}
      {...props}
    />
  );
}
Box.displayName = 'Box';

export { Box };
