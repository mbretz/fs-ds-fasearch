import { cn } from '../../utils/cn';
import { Label } from '../Label/Label';
import { Microcopy } from '../Microcopy/Microcopy';
import { Checkbox } from '../Checkbox/Checkbox';
import { GroupFieldList } from '../../internal/GroupFieldList';
import type {
  ChecklistGroupRootProps,
  ChecklistGroupGroupProps,
  ChecklistGroupNestedGroupProps,
} from './ChecklistGroup.types';

/**
 * Figma's `Checklist Group` (92:691) `State=Default` frame reports a real
 * 8px `gap` between Label/Slot/Microcopy — unlike TextInput.Root, which
 * intentionally adds no gap (see TextInput.tsx's note).
 *
 * The single grid column's minimum track size is `min(max-content,100%)`,
 * not a bare `max-content` — confirmed live (apps/locator's New Client
 * Inquiry form, 2026-09-23): a bare `max-content` floor means the column
 * can never shrink narrower than its widest single-line item, so a long
 * option (e.g. "Help with Financial Strategy Following Major Life
 * Event") just pushes the whole `w-fit` group wider than its container
 * instead of wrapping. Capping the floor at the container's own
 * available width (`100%`) once `max-content` would exceed it lets long
 * items wrap while short lists still hug their content exactly as
 * before. See Checkbox.tsx's own `min-w-0` note for the matching fix one
 * level down (the label `<span>` inside each row).
 */
function ChecklistGroupRoot({
  className,
  density,
  ref,
  ...props
}: ChecklistGroupRootProps) {
  return (
    <div
      ref={ref}
      data-density={density}
      className={cn(
        'grid w-fit grid-cols-[minmax(min(max-content,100%),1fr)] gap-[var(--component-checklist-group-gap)]',
        className,
      )}
      {...props}
    />
  );
}
ChecklistGroupRoot.displayName = 'ChecklistGroup.Root';

/**
 * Wires the shared GroupFieldList shell to ChecklistGroup's own
 * hand-added tokens (see packages/tokens/HAND_ADDED_TOKENS.md) via the
 * `--group-field-*` custom properties it reads from — see
 * internal/GroupFieldList.tsx for why this indirection exists.
 */
function ChecklistGroupGroup({
  className,
  density,
  error = false,
  style,
  ref,
  ...props
}: ChecklistGroupGroupProps) {
  return (
    <GroupFieldList
      ref={ref}
      density={density}
      error={error}
      orientation="vertical"
      className={className}
      style={
        {
          '--group-field-border-radius':
            'var(--component-checklist-group-border-radius)',
          '--group-field-border-color':
            'var(--component-checklist-group-border-color-error)',
          '--group-field-background-color':
            'var(--component-checklist-group-background-color-error)',
          ...style,
        } as React.CSSProperties
      }
      {...props}
    />
  );
}
ChecklistGroupGroup.displayName = 'ChecklistGroup.Group';

/**
 * Figma `Checklist` `Nested=True` (92:1074) authors `padding: 0px 40px`,
 * but the right-side padding has no visible effect once rows hug their own
 * content width (see GroupFieldList's items-start note) — left-only indent
 * instead, a deliberate deviation from the literal export value.
 */
function ChecklistGroupNestedGroup({
  className,
  ref,
  ...props
}: ChecklistGroupNestedGroupProps) {
  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col items-start pl-[var(--component-checklist-group-nested-indent)]',
        className,
      )}
      {...props}
    />
  );
}
ChecklistGroupNestedGroup.displayName = 'ChecklistGroup.NestedGroup';

/**
 * ChecklistGroup.Label, .Item, and .Microcopy are the standalone Label,
 * Checkbox, and Microcopy components, not separate implementations — same
 * "Input Label"/Microcopy reuse precedent as TextInput/TextArea/SelectInput,
 * plus Checkbox itself already matches the Figma `Checklist` sub-component's
 * item shape exactly (confirmed via re-fetch of 93:693).
 */
export const ChecklistGroup = {
  Root: ChecklistGroupRoot,
  Label,
  Group: ChecklistGroupGroup,
  NestedGroup: ChecklistGroupNestedGroup,
  Item: Checkbox,
  Microcopy,
};
