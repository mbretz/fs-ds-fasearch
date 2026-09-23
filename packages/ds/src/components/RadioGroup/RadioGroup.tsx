import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';
import { cn } from '../../utils/cn';
import { Label } from '../Label/Label';
import { Microcopy } from '../Microcopy/Microcopy';
import { RadioButton } from '../RadioButton/RadioButton';
import { GroupFieldList } from '../../internal/GroupFieldList';
import type {
  RadioGroupRootProps,
  RadioGroupGroupProps,
} from './RadioGroup.types';

/**
 * Unlike SelectInput.Root (which needs an extra wrapper div because
 * Radix's Select.Root renders no DOM node of its own), Radix's
 * RadioGroup.Root already renders a real `<div role="radiogroup">` — so
 * this styles that element directly instead of wrapping it.
 *
 * The single grid column's minimum track size is `min(max-content,100%)`,
 * not a bare `max-content` — same fix and reasoning as
 * ChecklistGroup.Root's own note (a bare `max-content` floor overflows
 * the container instead of wrapping a long option; capping it at the
 * container's own available width once `max-content` would exceed it
 * lets long options wrap while short lists still hug their content
 * exactly as before). Pairs with RadioButton.tsx's own `min-w-0` fix one
 * level down.
 */
function RadioGroupRoot({
  className,
  density,
  ref,
  ...props
}: RadioGroupRootProps) {
  return (
    <RadioGroupPrimitive.Root
      ref={ref}
      data-density={density}
      className={cn(
        'grid w-fit grid-cols-[minmax(min(max-content,100%),1fr)] gap-[var(--component-radio-group-gap)]',
        className,
      )}
      {...props}
    />
  );
}
RadioGroupRoot.displayName = 'RadioGroup.Root';

function RadioGroupGroup({
  className,
  density,
  error = false,
  orientation = 'vertical',
  style,
  ref,
  ...props
}: RadioGroupGroupProps) {
  return (
    <GroupFieldList
      ref={ref}
      density={density}
      error={error}
      orientation={orientation}
      className={className}
      style={
        {
          '--group-field-border-radius':
            'var(--component-radio-group-border-radius)',
          '--group-field-border-color':
            'var(--component-radio-group-border-color-error)',
          '--group-field-background-color':
            'var(--component-radio-group-background-color-error)',
          ...style,
        } as React.CSSProperties
      }
      {...props}
    />
  );
}
RadioGroupGroup.displayName = 'RadioGroup.Group';

/**
 * RadioGroup.Label, .Item, and .Microcopy are the standalone Label,
 * RadioButton, and Microcopy components, same reuse precedent as
 * ChecklistGroup — RadioButton already matches the Figma `Radio Group`
 * slot's item shape exactly (confirmed via re-fetch of 111:926). No
 * NestedGroup: Radio Group has no nesting concept in Figma, unlike
 * Checklist Group.
 */
export const RadioGroup = {
  Root: RadioGroupRoot,
  Label,
  Group: RadioGroupGroup,
  Item: RadioButton,
  Microcopy,
};
