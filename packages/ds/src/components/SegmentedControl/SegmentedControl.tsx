import { Tabs as TabsPrimitive } from 'radix-ui';
import { Button } from '../Button/Button';
import { cn } from '../../utils/cn';
import type {
  SegmentedControlRootProps,
  SegmentedControlListProps,
  SegmentedControlTriggerProps,
  SegmentedControlContentProps,
} from './SegmentedControl.types';

// Manual activation, not Radix's own `automatic` default: unlike a plain
// tab strip, each segment here can show a genuinely different view (e.g.
// list vs. map vs. satellite) with its own possibly-expensive setup
// (calling a map API, etc.) — arrow-key focus shouldn't unexpectedly
// trigger that. WAI-ARIA APG recommends automatic activation as the
// general default and reserves manual for exactly this case (activation
// is costly or the resulting content is disruptive), which is why this
// diverges from Tabs.tsx's own (unset, automatic) activationMode.
function SegmentedControlRoot({
  className,
  density,
  activationMode = 'manual',
  ref,
  ...props
}: SegmentedControlRootProps) {
  return (
    <TabsPrimitive.Root
      ref={ref}
      data-density={density}
      activationMode={activationMode}
      // `items-start`, not the flex default (`stretch`): List should hug
      // its own Triggers' width by default, matching Figma's own sizing.
      // Without this, Root's default cross-axis stretch would size List to
      // Root's own width (itself filling whatever ambient container width
      // it's given, being a block-level element) even when no full-width
      // behavior was asked for. List's own explicit `w-full` override (see
      // its own className docs) still wins over this per-instance, since
      // an explicit width always overrides a stretch/start default.
      className={cn('flex flex-col items-start', className)}
      {...props}
    />
  );
}
SegmentedControlRoot.displayName = 'SegmentedControl.Root';

/** Maps to Figma's "Slot - SegmentedControl" node — the pill-shaped track. */
function SegmentedControlList({
  className,
  ref,
  ...props
}: SegmentedControlListProps) {
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        'inline-flex items-center gap-[var(--density-spacing-dynamic-x-small)] rounded-[var(--component-segmented-control-border-radius)] bg-[var(--component-segmented-control-background-color)] p-[var(--density-spacing-dynamic-x-small)] shadow-elevation-carved',
        className,
      )}
      {...props}
    />
  );
}
SegmentedControlList.displayName = 'SegmentedControl.List';

// Sizing (min-height/padding/gap/line-height) is borrowed from Button's own
// density-aware tokens, not a dedicated set — the Figma frame's inner
// "Button" instance (102:2513, variant=tertiary) confirms these values
// already match exactly, same borrowed-token precedent as Tab's own
// min-height (see packages/tokens/HAND_ADDED_TOKENS.md, "component.tab").
// Color/weight/shadow state comes from Radix's own `data-state`
// (active/inactive), matching Figma's `Selected=True/False` axis — no
// `selected` prop, same rule Tab's own active styling follows.
function SegmentedControlTrigger({
  className,
  children,
  icon,
  ref,
  ...props
}: SegmentedControlTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        'inline-flex min-h-[var(--component-button-min-height)] min-w-[var(--component-button-min-width)] shrink-0 cursor-pointer items-center justify-center gap-[var(--component-button-gap)] rounded-[var(--component-segmented-control-button-border-radius)] border-0 bg-[var(--component-segmented-control-button-background-color-inactive)] px-[var(--component-button-padding-inline)] py-[var(--component-button-padding-block)] text-[length:var(--component-segmented-control-font-size)] leading-[length:var(--component-button-line-height)] font-[number:var(--component-segmented-control-button-font-weight-inactive)] text-[color:var(--component-segmented-control-button-text-color-inactive)] outline-none hover:text-[color:var(--component-segmented-control-button-text-color-hover)] focus-visible:shadow-[inset_0_0_0_var(--semantic-control-border-width-active)_var(--component-segmented-control-button-text-color-active)] data-[state=active]:bg-[var(--component-segmented-control-button-background-color-active)] data-[state=active]:font-[number:var(--component-segmented-control-button-font-weight-active)] data-[state=active]:text-[color:var(--component-segmented-control-button-text-color-active)] data-[state=active]:shadow-elevation-settled data-[state=active]:hover:bg-[var(--component-segmented-control-button-background-color-hover)] disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {icon && <Button.Icon>{icon}</Button.Icon>}
      {/*
        Active vs. inactive is a real font-weight change (400 -> 600, per
        Figma), and bold glyphs are wider than regular ones — without a
        fix, selecting a segment would grow its box and shift every segment
        after it. Same fix as Tabs.Trigger: render the label twice, stacked
        in one grid cell, with one copy permanently locked at the bold
        weight to reserve the width, the other the real toggling copy.
      */}
      <Button.Label className="grid text-center">
        <span
          aria-hidden
          className="invisible col-start-1 row-start-1 font-[number:var(--component-segmented-control-button-font-weight-active)]"
        >
          {children}
        </span>
        <span className="col-start-1 row-start-1">{children}</span>
      </Button.Label>
    </TabsPrimitive.Trigger>
  );
}
SegmentedControlTrigger.displayName = 'SegmentedControl.Trigger';

/** No Figma authoring for panel content — unstyled passthrough, same as Tabs.Content. */
function SegmentedControlContent({
  className,
  ref,
  ...props
}: SegmentedControlContentProps) {
  return (
    <TabsPrimitive.Content ref={ref} className={cn(className)} {...props} />
  );
}
SegmentedControlContent.displayName = 'SegmentedControl.Content';

export const SegmentedControl = {
  Root: SegmentedControlRoot,
  List: SegmentedControlList,
  Trigger: SegmentedControlTrigger,
  Content: SegmentedControlContent,
};
