import { Separator as SeparatorPrimitive } from 'radix-ui';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import type { SeparatorProps } from './Separator.types';

export const separatorVariants = cva(
  'shrink-0 border-none bg-none bg-no-repeat',
  {
    variants: {
      orientation: {
        horizontal:
          'h-[length:var(--component-separator-thickness)] w-full bg-[image:var(--component-separator-gradient-horizontal)]',
        vertical:
          'h-full w-[length:var(--component-separator-thickness)] bg-[image:var(--component-separator-gradient-vertical)]',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
    },
  },
);

function Separator({ className, orientation, ref, ...props }: SeparatorProps) {
  return (
    <SeparatorPrimitive.Root
      ref={ref}
      orientation={orientation}
      className={cn(separatorVariants({ orientation }), className)}
      {...props}
    />
  );
}
Separator.displayName = 'Separator';

export { Separator };
