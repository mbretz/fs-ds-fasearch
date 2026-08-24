import type { ComponentProps } from 'react';
import type { Popover as PopoverPrimitive } from 'radix-ui';
import type { ButtonProps } from '../Button/Button.types';

export interface FilterMenuRootProps extends ComponentProps<
  typeof PopoverPrimitive.Root
> {
  className?: string;
  density?: 'roomy' | 'condensed';
}

export type FilterMenuHeaderProps = ComponentProps<'div'>;

/**
 * Figma's fixed icon+label ("filter" icon, no exposed text property) — the
 * label is `children` rather than a hardcoded string so the component stays
 * reusable, matching how Dialog's Header/Body/Footer stay generic slots
 * despite Figma naming them as fixed compounds.
 */
export type FilterMenuTriggerProps = Omit<ButtonProps, 'variant' | 'iconStart'>;

export interface FilterMenuClearButtonProps extends Omit<
  ButtonProps,
  'variant' | 'iconEnd'
> {
  /** Renders a Tag count badge in iconEnd when provided. */
  count?: number;
}

// No Portal — Figma shows Content as a plain in-flow child, not portaled to
// document.body, so (unlike Dialog/SelectInput) it naturally inherits an
// ambient data-density ancestor and needs no concrete default here.
export interface FilterMenuContentProps extends ComponentProps<
  typeof PopoverPrimitive.Content
> {
  density?: 'roomy' | 'condensed';
}

export type FilterMenuDrawerProps = ComponentProps<'div'>;

export type FilterMenuFooterProps = ComponentProps<'div'>;
