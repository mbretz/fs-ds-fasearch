import { ScrollArea as ScrollAreaPrimitive } from 'radix-ui';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import type {
  ScrollAreaRootProps,
  ScrollAreaViewportProps,
  ScrollAreaScrollbarProps,
  ScrollAreaThumbProps,
  ScrollAreaCornerProps,
  ScrollAreaProps,
} from './ScrollArea.types';

export const scrollAreaScrollbarVariants = cva(
  'flex touch-none select-none p-px opacity-100 transition-opacity duration-150 ease-out data-[state=hidden]:opacity-0',
  {
    variants: {
      orientation: {
        vertical: 'h-full w-[var(--density-sizing-dynamic-small)] flex-col',
        horizontal: 'h-[var(--density-sizing-dynamic-small)] flex-row',
      },
    },
    defaultVariants: {
      orientation: 'vertical',
    },
  },
);

function ScrollAreaRoot({
  className,
  density,
  ref,
  ...props
}: ScrollAreaRootProps) {
  return (
    <ScrollAreaPrimitive.Root
      ref={ref}
      data-density={density}
      className={cn('overflow-hidden', className)}
      {...props}
    />
  );
}
ScrollAreaRoot.displayName = 'ScrollArea.Root';

function ScrollAreaViewport({
  className,
  ref,
  ...props
}: ScrollAreaViewportProps) {
  return (
    <ScrollAreaPrimitive.Viewport
      ref={ref}
      className={cn('size-full', className)}
      {...props}
    />
  );
}
ScrollAreaViewport.displayName = 'ScrollArea.Viewport';

function ScrollAreaScrollbar({
  className,
  orientation,
  ref,
  ...props
}: ScrollAreaScrollbarProps) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      ref={ref}
      orientation={orientation}
      className={cn(scrollAreaScrollbarVariants({ orientation }), className)}
      {...props}
    />
  );
}
ScrollAreaScrollbar.displayName = 'ScrollArea.Scrollbar';

function ScrollAreaThumb({ className, ref, ...props }: ScrollAreaThumbProps) {
  return (
    <ScrollAreaPrimitive.Thumb
      ref={ref}
      className={cn(
        'flex-1 rounded-full bg-neutral-subtle transition-colors duration-150 ease-out hover:bg-neutral-strong',
        className,
      )}
      {...props}
    />
  );
}
ScrollAreaThumb.displayName = 'ScrollArea.Thumb';

function ScrollAreaCorner({ className, ref, ...props }: ScrollAreaCornerProps) {
  return (
    <ScrollAreaPrimitive.Corner
      ref={ref}
      className={cn('bg-transparent', className)}
      {...props}
    />
  );
}
ScrollAreaCorner.displayName = 'ScrollArea.Corner';

// Flat convenience wrapper for the common single-viewport case -- composes
// Root/Viewport/Scrollbar/Thumb/Corner so most consumers never reach for the
// compound parts directly. There's no bespoke imperative scroll API here:
// `Element.scrollIntoView()` already works natively on any child rendered
// inside Viewport (it's a real scrolling container), so a locator list row
// scrolls itself into view via its own ref, same as anywhere else in the DOM.
function ScrollArea({
  className,
  viewportClassName,
  density,
  horizontal,
  children,
  ref,
  ...props
}: ScrollAreaProps) {
  return (
    <ScrollAreaRoot
      ref={ref}
      density={density}
      className={className}
      {...props}
    >
      <ScrollAreaViewport className={viewportClassName}>
        {children}
      </ScrollAreaViewport>
      <ScrollAreaScrollbar orientation="vertical">
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
      {horizontal && (
        <ScrollAreaScrollbar orientation="horizontal">
          <ScrollAreaThumb />
        </ScrollAreaScrollbar>
      )}
      <ScrollAreaCorner />
    </ScrollAreaRoot>
  );
}
ScrollArea.displayName = 'ScrollArea';

const ScrollAreaCompound = Object.assign(ScrollArea, {
  Root: ScrollAreaRoot,
  Viewport: ScrollAreaViewport,
  Scrollbar: ScrollAreaScrollbar,
  Thumb: ScrollAreaThumb,
  Corner: ScrollAreaCorner,
});

export { ScrollAreaCompound as ScrollArea };
