import { Popover as PopoverPrimitive } from 'radix-ui';
import { Filter } from 'icons';
import { lightRoomyTokens } from 'tokens';
import { cn } from '../../utils/cn';
import { Button } from '../Button/Button';
import { Tag } from '../Tag/Tag';
import type {
  FilterMenuRootProps,
  FilterMenuHeaderProps,
  FilterMenuTriggerProps,
  FilterMenuClearButtonProps,
  FilterMenuContentProps,
  FilterMenuDrawerProps,
  FilterMenuFooterProps,
} from './FilterMenu.types';

function FilterMenuRoot({
  className,
  density,
  children,
  ...props
}: FilterMenuRootProps) {
  return (
    <div
      data-density={density}
      className={cn('inline-flex flex-col', className)}
    >
      <PopoverPrimitive.Root {...props}>{children}</PopoverPrimitive.Root>
    </div>
  );
}
FilterMenuRoot.displayName = 'FilterMenu.Root';

// Anchor, not the Trigger button itself — Content aligns to the whole
// header row (matching Figma's HeaderWrap -> Content offset), not just the
// trigger's own bounds.
function FilterMenuHeader({
  className,
  children,
  ref,
  ...props
}: FilterMenuHeaderProps) {
  return (
    <PopoverPrimitive.Anchor asChild>
      <div
        ref={ref}
        className={cn(
          'flex items-end gap-[var(--component-filter-menu-header-gap)] rounded-[var(--component-filter-menu-header-border-radius)]',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </PopoverPrimitive.Anchor>
  );
}
FilterMenuHeader.displayName = 'FilterMenu.Header';

// Figma's Trigger/Button nodes expose no text property, so the "Show
// Filters" label is `children`, not a hardcoded string. The built-in
// Show/Hide swap (collapsedLabel/expandedLabel) reads Radix Popover.
// Trigger's own `data-state` via `group-data-[state=open]:`, same
// pseudo-state-stays-CSS-only precedent as Card's caret rotation — only
// the visible span contributes to the button's accessible name, so no
// extra aria-label bookkeeping is needed either.
function FilterMenuTrigger({
  className,
  children,
  collapsedLabel,
  expandedLabel,
  ...props
}: FilterMenuTriggerProps) {
  const hasLabelSwap = collapsedLabel !== undefined && expandedLabel !== undefined;

  return (
    <PopoverPrimitive.Trigger asChild>
      <Button
        variant="tertiary"
        iconStart={<Filter aria-hidden />}
        className={cn(hasLabelSwap && 'group', className)}
        {...props}
      >
        {hasLabelSwap ? (
          <>
            <span className="group-data-[state=open]:hidden">
              {collapsedLabel}
            </span>
            <span className="hidden group-data-[state=open]:inline">
              {expandedLabel}
            </span>
          </>
        ) : (
          children
        )}
      </Button>
    </PopoverPrimitive.Trigger>
  );
}
FilterMenuTrigger.displayName = 'FilterMenu.Trigger';

// Plain Button, not a Popover.Trigger — clearing filters shouldn't toggle
// the panel open/closed.
function FilterMenuClearButton({
  count,
  children,
  ...props
}: FilterMenuClearButtonProps) {
  return (
    <Button
      variant="tertiary"
      iconEnd={
        count !== undefined ? (
          <Tag variant="generic" size="sm" className="border-primary">
            {count}
          </Tag>
        ) : undefined
      }
      {...props}
    >
      {children}
    </Button>
  );
}
FilterMenuClearButton.displayName = 'FilterMenu.ClearButton';

// spacing.fixed.x-small (4px, density-invariant -- `lightRoomyTokens` is
// used arbitrarily below since the value doesn't change across mode
// combos). Popper's sideOffset takes a plain number, not a CSS var, so this
// reads packages/tokens' JS token output directly rather than mirroring the
// value by hand.
const CONTENT_SIDE_OFFSET = lightRoomyTokens.densitySpacingFixedXSmall;

// No Popover.Portal — Figma shows this as a plain in-flow panel, not
// portaled to document.body, so it keeps inheriting an ambient data-density
// ancestor like Card does (unlike Dialog/SelectInput's portal-driven
// default-to-'roomy').
function FilterMenuContent({
  className,
  density,
  children,
  ref,
  ...props
}: FilterMenuContentProps) {
  return (
    <PopoverPrimitive.Content
      ref={ref}
      data-density={density}
      align="start"
      sideOffset={CONTENT_SIDE_OFFSET}
      className={cn(
        'z-index-popover flex flex-col gap-[var(--component-filter-menu-content-gap)] rounded-[var(--component-filter-menu-content-border-radius)] border-[length:var(--component-filter-menu-content-border-width)] border-[color:var(--component-filter-menu-content-border-color)] bg-[var(--component-filter-menu-content-background-color)] p-[var(--component-filter-menu-content-padding)] shadow-elevation-raised',
        className,
      )}
      {...props}
    >
      {children}
    </PopoverPrimitive.Content>
  );
}
FilterMenuContent.displayName = 'FilterMenu.Content';

function FilterMenuDrawer({
  className,
  children,
  ref,
  ...props
}: FilterMenuDrawerProps) {
  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col items-start gap-[var(--component-filter-menu-drawer-gap)] p-[var(--component-filter-menu-drawer-padding)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
FilterMenuDrawer.displayName = 'FilterMenu.Drawer';

// Generic row slot for consumer-supplied Buttons — same precedent as
// Dialog.Footer (Figma's fixed-looking "Apply Filters" nested instance is
// still coded as a plain children slot, not baked in).
function FilterMenuFooter({
  className,
  children,
  ref,
  ...props
}: FilterMenuFooterProps) {
  return (
    <div
      ref={ref}
      className={cn(
        'flex items-center gap-[var(--component-filter-menu-footer-gap)] p-[var(--component-filter-menu-footer-padding)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
FilterMenuFooter.displayName = 'FilterMenu.Footer';

export const FilterMenu = {
  Root: FilterMenuRoot,
  Header: FilterMenuHeader,
  Trigger: FilterMenuTrigger,
  ClearButton: FilterMenuClearButton,
  Content: FilterMenuContent,
  Drawer: FilterMenuDrawer,
  Footer: FilterMenuFooter,
};
