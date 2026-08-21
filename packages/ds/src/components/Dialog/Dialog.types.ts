import type { ComponentProps, ReactNode } from 'react';
import type { Dialog as DialogPrimitive } from 'radix-ui';

export interface DialogRootProps extends Pick<
  ComponentProps<typeof DialogPrimitive.Root>,
  'open' | 'defaultOpen' | 'onOpenChange' | 'modal' | 'children'
> {}

export type DialogTriggerProps = ComponentProps<typeof DialogPrimitive.Trigger>;

// Header/body/footer padding+gap are density-invariant (spacing.fixed.small,
// 8px) — confirmed with the user (2026-08-21), unlike Card's own header/body/
// footer slots which are genuinely density-reactive. Only the root's own
// content padding (--component-dialog-spacing-padding) varies by density.
export interface DialogContentProps extends Omit<
  ComponentProps<typeof DialogPrimitive.Content>,
  'title'
> {
  /** Always rendered — matches Figma's non-optional title text property. */
  title: ReactNode;
  /**
   * Optional description, styled from `component.dialog.description.*`.
   * Addresses Radix's dev-time a11y warning for consumers who pass one;
   * omitting it leaves the same warning Radix emits for any bare usage.
   */
  description?: ReactNode;
  /** Sets data-density explicitly on the portal content root. */
  density?: 'roomy' | 'condensed';
  /** Overrides the default "Close" accessible name on the built-in close button. */
  closeButtonAriaLabel?: string;
  /** Whether the backdrop Scrim renders behind Content. Defaults to true. */
  showScrim?: boolean;
  /** Merged onto the backdrop Scrim — e.g. to override its default z-50 if it conflicts with another stacking context. */
  scrimClassName?: string;
}

export type DialogHeaderProps = ComponentProps<'div'>;

export type DialogBodyProps = ComponentProps<'div'>;

export type DialogFooterProps = ComponentProps<'div'>;

export type DialogCloseProps = ComponentProps<typeof DialogPrimitive.Close>;
