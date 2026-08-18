import { Tabs as TabsPrimitive } from 'radix-ui';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import type {
  TabsRootProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
} from './Tabs.types';

// Active's border grows 1px->4px in Figma; stack an inset shadow on a
// fixed 1px border instead of growing border-width, so height stays equal
// across states — same trick as Button's focus-visible ring.
//
// Height target is density-exact (48px roomy / 32px condensed), same as
// Button's own min-height — reuses Button's density-aware padding-block/
// line-height tokens since Tab visually derives from Button-tertiary. The
// border only sits on the bottom edge (not all 4 sides like Button's), so
// only pb- subtracts the border width: pt + line-height + (pb - border) +
// border = pt + line-height + pb, the border cancels out regardless of
// which border-width state is active, same result Button gets symmetrically.
export const tabsTriggerVariants = cva(
  'inline-flex items-center justify-center border-0 border-b-[length:var(--component-tab-border-width-inactive)] border-b-[color:var(--component-tab-border-color-block-end-inactive)] border-solid bg-[var(--component-tab-background-color-default)] px-[var(--component-tab-padding-inline)] pt-[var(--component-tab-padding-block)] pb-[calc(var(--component-tab-padding-block)-var(--component-tab-border-width-inactive))] text-[length:var(--component-tab-font-size-default)] leading-[length:var(--component-tab-line-height)] font-[number:var(--component-tab-font-weight-default)] text-[color:var(--component-tab-text-color-default)] outline-none cursor-pointer hover:bg-[var(--component-tab-background-color-hover)] data-[state=active]:border-b-[color:var(--component-tab-border-color-block-end-active)] data-[state=active]:font-[number:var(--component-tab-font-weight-active)] data-[state=active]:shadow-[inset_0_calc(var(--component-tab-border-width-inactive)-var(--component-tab-border-width-active))_0_0_var(--component-tab-border-color-block-end-active)] disabled:cursor-not-allowed disabled:bg-[var(--component-tab-background-color-default)] disabled:text-[color:var(--component-tab-text-color-disabled)] disabled:data-[state=active]:border-b-[color:var(--component-tab-border-color-block-end-inactive)] disabled:data-[state=active]:font-[number:var(--component-tab-font-weight-default)] disabled:data-[state=active]:shadow-none',
);

function TabsRoot({ className, density, ref, ...props }: TabsRootProps) {
  return (
    <TabsPrimitive.Root
      ref={ref}
      data-density={density}
      className={cn('flex flex-col', className)}
      {...props}
    />
  );
}
TabsRoot.displayName = 'Tabs.Root';

/** Maps to Figma's "Tabs" node (158:4670) itself — the row of Tab instances. */
function TabsList({ className, ref, ...props }: TabsListProps) {
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        'inline-flex items-center bg-[var(--component-tab-background-color-default)]',
        className,
      )}
      {...props}
    />
  );
}
TabsList.displayName = 'Tabs.List';

// No `active` prop — styled off Radix's own `data-state`/`disabled`
// attributes, same rule RadioButton established for ancestor-driven disabled.
function TabsTrigger({ className, children, ref, ...props }: TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(tabsTriggerVariants(), className)}
      {...props}
    >
      {/*
        Active vs. inactive is a real font-weight change (400 -> 600, per
        Figma), and bold glyphs are wider than regular ones — without a
        fix, activating a tab would grow its box and shift every tab after
        it. The standard countermeasure: render the label twice, stacked in
        one CSS grid cell (a grid cell sizes to its largest child), with one
        copy permanently locked at the bold weight so the reserved width
        never shrinks below the widest state, while the other copy is the
        real, currently-visible label that still toggles weight normally.

        Considered a CSS-only variant instead — a `::before` pseudo-element
        with `content: attr(data-label)` doing the same reservation, so
        there'd be no second real DOM node at all (generated content isn't
        part of the DOM and is excluded from accessible-name computation by
        spec, so it wouldn't even need `aria-hidden`). Rejected: `attr()`
        can only mirror a plain string, but `Tab` wraps a `Button` internally
        and `Button` already supports `iconStart`/`iconEnd` — capping this
        component to string-only children now would block adding icon
        support later without revisiting this mechanism, for a marginal a11y
        win that's already fully covered by `aria-hidden` below. A real
        duplicate node that mirrors whatever `children` actually is (text,
        icon, or both) stays correct regardless of what gets rendered here
        in the future, so it's the more durable choice even though it's the
        less "clever" one.
      */}
      <span className="grid text-center">
        <span
          aria-hidden
          className="invisible col-start-1 row-start-1 font-[number:var(--component-tab-font-weight-active)]"
        >
          {children}
        </span>
        <span className="col-start-1 row-start-1">{children}</span>
      </span>
    </TabsPrimitive.Trigger>
  );
}
TabsTrigger.displayName = 'Tabs.Trigger';

/** No Figma authoring for panel content — unstyled passthrough. */
function TabsContent({ className, ref, ...props }: TabsContentProps) {
  return (
    <TabsPrimitive.Content ref={ref} className={cn(className)} {...props} />
  );
}
TabsContent.displayName = 'Tabs.Content';

export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
};
