import { Slot } from 'radix-ui';
import { cn } from '../../utils/cn';
import type { ScrimProps } from './Scrim.types';

// No z-index of its own — stacking context depends on what's layered above
// it (e.g. Dialog.Content), so that's left to the consumer's className,
// same as every other component not assuming its own place in the layout.
function Scrim({ className, asChild, ref, ...props }: ScrimProps) {
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <Comp
      ref={ref}
      className={cn(
        'fixed inset-0 bg-[var(--component-scrim-background-color)]',
        className,
      )}
      {...props}
    />
  );
}
Scrim.displayName = 'Scrim';

export { Scrim };
