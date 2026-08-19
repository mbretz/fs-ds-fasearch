import type { ComponentProps, ReactNode, Ref } from 'react';
import type { Collapsible as CollapsiblePrimitive } from 'radix-ui';

// Header padding/gap (surface.med) and Body/Footer padding/gap
// (surface.large) are density-reactive Figma Variables bound directly on
// the slots — confirmed with the user (2026-08-19), unlike Tag.
export interface CardRootProps
  extends
    Omit<ComponentProps<'div'>, 'onOpenChange'>,
    Pick<
      ComponentProps<typeof CollapsiblePrimitive.Root>,
      'open' | 'defaultOpen' | 'onOpenChange' | 'disabled'
    > {
  density?: 'roomy' | 'condensed';
  asChild?: boolean;
}

// `ref` is widened to HTMLElement — the rendered tag itself switches
// between <div> and Radix's <button> Trigger depending on `expandable`.
export interface CardHeaderProps extends Omit<ComponentProps<'div'>, 'ref'> {
  ref?: Ref<HTMLElement>;
  /**
   * Whether the header is the Collapsible trigger (Figma's "Show
   * Description-Control"). When true, children render inside a native
   * <button> — don't nest other interactive elements (links, buttons,
   * form controls) inside; HTML forbids interactive content inside a
   * <button>, and nested-interactive a11y/focus behavior is unreliable
   * across browsers regardless.
   */
  expandable?: boolean;
  /**
   * Whether the bottom border can show at all. Original Figma design
   * always showed it on non-expandable headers; now a user choice,
   * defaulting to visible. On a non-expandable header it's static; on an
   * expandable header it still only shows while open — `showBorder={false}`
   * disables it outright in both cases.
   */
  showBorder?: boolean;
}

export interface CardHeaderTitleProps extends ComponentProps<'div'> {
  icon?: ReactNode;
}

export type CardHeaderDescriptionProps = ComponentProps<'div'>;

export type CardBodyProps = ComponentProps<'div'>;

export type CardFooterProps = ComponentProps<'div'>;
