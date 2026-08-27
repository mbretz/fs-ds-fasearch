import { Slot } from 'radix-ui';
import { cn } from '../../utils/cn';
import type { ScrimProps } from './Scrim.types';

// No default z-index — Scrim doesn't assume a role in the layout, so its
// consumer applies one of theme.css's z-index-* utilities via className
// (Dialog uses z-index-overlay).
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
