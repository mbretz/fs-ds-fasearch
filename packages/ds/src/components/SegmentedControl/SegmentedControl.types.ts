import type { ComponentProps, ReactNode } from 'react';
import type { Tabs as TabsPrimitive } from 'radix-ui';

// Built on Radix Tabs — same interaction model Tabs.tsx already covers
// (single selection swaps visible panel content), just a different use of
// it: SegmentedControl switches the *format* of the same underlying
// content (e.g. list vs. map view of the same stores), where Tabs switches
// between different or related pieces of content (Account vs. Security
// settings). That distinction is what Figma is capturing by authoring
// SegmentedControl (155:4365) as its own visually distinct component from
// Tabs (158:4670), rather than the same primitive difference in code.
export interface SegmentedControlRootProps extends ComponentProps<
  typeof TabsPrimitive.Root
> {
  density?: 'roomy' | 'condensed';
}

/**
 * Maps to Figma's "Slot - SegmentedControl" — the pill-shaped track. Hugs
 * its Triggers' content width by default (Figma's own sizing). To stretch
 * to fill a container instead (e.g. a mobile-width layout), pass
 * `className="flex w-full"` here and `className="grow basis-0"` on each
 * Trigger — plain utility overrides via the existing `className` escape
 * hatch, same as how Button's own `w-full` story handles it, rather than a
 * dedicated prop for a single-purpose Tailwind toggle.
 */
export type SegmentedControlListProps = ComponentProps<
  typeof TabsPrimitive.List
>;

export interface SegmentedControlTriggerProps extends ComponentProps<
  typeof TabsPrimitive.Trigger
> {
  /** Leading icon, matching Figma's `Show Icon Start` slot. */
  icon?: ReactNode;
}

/** No Figma authoring for panel content — unstyled passthrough, same as Tabs.Content. */
export type SegmentedControlContentProps = ComponentProps<
  typeof TabsPrimitive.Content
>;
