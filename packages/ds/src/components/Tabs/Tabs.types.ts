import type { ComponentProps } from 'react';
import type { Tabs as TabsPrimitive } from 'radix-ui';

export interface TabsRootProps extends ComponentProps<
  typeof TabsPrimitive.Root
> {
  density?: 'roomy' | 'condensed';
}

export type TabsListProps = ComponentProps<typeof TabsPrimitive.List>;

export type TabsTriggerProps = ComponentProps<typeof TabsPrimitive.Trigger>;

export type TabsContentProps = ComponentProps<typeof TabsPrimitive.Content>;
