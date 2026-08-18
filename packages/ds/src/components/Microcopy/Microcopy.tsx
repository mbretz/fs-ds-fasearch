import { cn } from '../../utils/cn';
import type { MicrocopyProps } from './Microcopy.types';

function Microcopy({
  className,
  error = false,
  ref,
  ...props
}: MicrocopyProps) {
  return (
    <p
      ref={ref}
      className={cn(
        'font-[number:var(--component-label-font-weight-default)] text-[length:var(--component-label-font-size-default)]',
        error
          ? 'text-[color:var(--component-label-text-color-error)]'
          : 'text-[color:var(--component-label-text-color-microcopy)]',
        className,
      )}
      {...props}
    />
  );
}
Microcopy.displayName = 'Microcopy';

export { Microcopy };
