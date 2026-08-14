import { Label as LabelPrimitive } from 'radix-ui';
import { cva } from 'class-variance-authority';
import { NoticeError } from 'icons';
import { cn } from '../../utils/cn';
import type { LabelProps } from './Label.types';

/**
 * Styles only the inline text run (asterisk + label content), not the
 * icon or the "(Optional)" suffix — those two read from the `microcopy`
 * color token directly rather than participating in the error/default
 * split, matching the Figma source (Error=true, Requirement=optional
 * 301:1742: the red styling stops at the label text, the trailing
 * "(Optional)" stays gray in both error states).
 */
export const labelTextVariants = cva('', {
  variants: {
    error: {
      true: 'font-[number:var(--component-label-font-weight-error)] text-[color:var(--component-label-text-color-error)]',
      false:
        'font-[number:var(--component-label-font-weight-default)] text-[color:var(--component-label-text-color-default)]',
    },
  },
  defaultVariants: {
    error: false,
  },
});

/**
 * No `density` prop — packages/tokens has no density-mode overrides for
 * `component-label-*` (font-size/weight/color are flat across roomy and
 * condensed), so there's nothing for a density switch to change. Same
 * reasoning as Avatar's fixed size scale (see Avatar.tsx).
 *
 * No `asChild` — a Label's whole value is being a real `<label>` (native
 * `htmlFor` association, Radix's own click-without-selecting-text fix);
 * Slot composition would let a consumer swap that away, which is never
 * meaningful here the way it is for Button or Card.
 */
function Label({
  className,
  requirement,
  error = false,
  children,
  ref,
  ...props
}: LabelProps) {
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1 text-[length:var(--component-label-font-size-default)]',
        className,
      )}
      {...props}
    >
      {error && <NoticeError aria-hidden className="size-5 shrink-0" />}
      <span className={labelTextVariants({ error })}>
        {requirement === 'required' && (
          <span aria-hidden className="mr-1">
            *
          </span>
        )}
        {children}
      </span>
      {requirement === 'optional' && (
        <span className="font-[number:var(--component-label-font-weight-default)] text-[color:var(--component-label-text-color-microcopy)]">
          {' '}
          (Optional)
        </span>
      )}
    </LabelPrimitive.Root>
  );
}
Label.displayName = 'Label';

export { Label };
