import { Slot } from 'radix-ui';
import { NewWindowSm } from 'icons';
import { cn } from '../../utils/cn';
import type { LinkProps } from './Link.types';

// Figma's Visited=True/False is a real :visited pseudo-class, never a JS
// prop, same precedent as State=Idle/Hover elsewhere. Visited text color
// stays constant even on hover (only the background highlight changes) —
// confirmed against the live frame data, not assumed.
const iconVerticalAlignClassName = {
  start: 'align-text-top',
  center: 'align-middle',
  end: 'align-text-bottom',
} as const;

function Link({
  className,
  newWindow,
  underline = true,
  iconVerticalAlign = 'end',
  asChild,
  target,
  rel,
  children,
  ref,
  ...props
}: LinkProps) {
  const Comp = asChild ? Slot.Root : 'a';
  return (
    <Comp
      ref={ref}
      target={newWindow ? '_blank' : target}
      rel={newWindow ? 'noopener noreferrer' : rel}
      className={cn(
        'text-[length:var(--component-link-font-size-default)] leading-[1.5] font-[number:var(--component-link-font-weight-default)] text-[color:var(--component-link-text-color-default)] not-visited:hover:text-[color:var(--component-link-text-color-hover)] visited:text-[color:var(--component-link-text-color-visited)] hover:bg-[var(--component-link-background-color-hover)]',
        underline
          ? 'underline decoration-[length:var(--component-link-underline-thickness)] underline-offset-[length:var(--component-link-underline-offset)]'
          : 'no-underline',
        className,
      )}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {children}
          {newWindow && (
            <>
              <NewWindowSm
                aria-hidden="true"
                className={cn(
                  'ml-[var(--component-link-icon-gap)] inline-block size-[var(--component-link-icon-size-default)] pb-[var(--component-link-icon-padding-bottom)]',
                  iconVerticalAlignClassName[iconVerticalAlign],
                )}
              />
              <span className="sr-only"> (opens in a new window)</span>
            </>
          )}
        </>
      )}
    </Comp>
  );
}
Link.displayName = 'Link';

export { Link };
