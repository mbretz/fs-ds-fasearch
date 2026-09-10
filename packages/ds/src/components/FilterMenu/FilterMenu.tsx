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
  const hasLabelSwap =
    collapsedLabel !== undefined && expandedLabel !== undefined;

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
//
// `max-h-[var(--radix-popper-available-height)]` + `overflow-hidden` caps
// the whole panel to whatever room Popper actually measured between the
// trigger and the viewport edge — Radix's `size` middleware sets this CSS
// var on the Content element itself unconditionally, regardless of
// `avoidCollisions` (that prop only gates the `shift`/`flip` middleware,
// not `size`), so it stays accurate even with `avoidCollisions={false}`
// above. Without this cap, a checklist longer than the viewport (e.g. 16+
// focus areas on a short window) pushes Footer's Apply/Clear buttons
// entirely off-screen with no way to reach them — caught via an automated
// browser check at a short viewport height, not visually obvious at
// typical window sizes. `FilterMenu.Drawer` below does the actual
// scrolling (`overflow-y-auto`); Footer stays outside that scroll region
// (`shrink-0`) so it's always reachable regardless of list length.
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
      // Figma's drawer is always below the trigger — override Popper's
      // default flip-on-collision behavior. Consumers can still pass
      // their own side/avoidCollisions to opt back out (spread below).
      side="bottom"
      avoidCollisions={false}
      sideOffset={CONTENT_SIDE_OFFSET}
      className={cn(
        'z-index-popover flex max-h-[var(--radix-popper-available-height)] flex-col gap-[var(--component-filter-menu-content-gap)] overflow-hidden rounded-[var(--component-filter-menu-content-border-radius)] border-[length:var(--component-filter-menu-content-border-width)] border-[color:var(--component-filter-menu-content-border-color)] bg-[var(--component-filter-menu-content-background-color)] p-[var(--component-filter-menu-content-padding)] shadow-elevation-raised',
        className,
      )}
      {...props}
    >
      {children}
    </PopoverPrimitive.Content>
  );
}
FilterMenuContent.displayName = 'FilterMenu.Content';

// `min-h-0` is load-bearing alongside `overflow-y-auto`: a flex child
// otherwise refuses to shrink below its content's height (flex's default
// `min-height: auto`), which would defeat Content's own `max-h` clamp above
// and push Footer off-screen exactly as before.
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
        'flex min-h-0 flex-col items-start gap-[var(--component-filter-menu-drawer-gap)] overflow-y-auto p-[var(--component-filter-menu-drawer-padding)]',
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
// still coded as a plain children slot, not baked in). `shrink-0`: this sits
// outside Drawer's own scroll region (see FilterMenu.Content's comment on
// the max-height clamp), so it must never be the thing that gives when the
// panel runs out of vertical room -- Drawer above it is what scrolls instead.
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
        'flex shrink-0 items-center gap-[var(--component-filter-menu-footer-gap)] p-[var(--component-filter-menu-footer-padding)]',
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
