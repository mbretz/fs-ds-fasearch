---
title: 'Checkbox'
---

# Checkbox

A checkbox is an input option that represents a setting or value with an on, off, or indeterminate choice.

## Guidelines

Checkboxes can have a parent-child relationship with other checkboxes. The parent checkbox enters an indeterminate or mixed state when some, but not all, child checkboxes are checked.

- Checking the parent checkbox automatically checks all associated child checkboxes.
- Unchecking the parent checkbox also unchecks all child checkboxes.
- If some, but not all, child checkboxes are checked, the parent checkbox becomes indeterminate.

## Accessibility

### Keyboard controls

| Key      | Behavior                                                                                      |
| -------- | --------------------------------------------------------------------------------------------- |
| Tab      | Moves focus to the first checkbox in the group and continues through the checkboxes in order. |
| Spacebar | Changes the state of the currently focused checkbox.                                          |
| Tab      | Moves focus away from the checkbox group when the last checkbox is focused.                   |

### Focus management

Focus remains on the checkbox as the user changes its state.

### Screen reader behavior

- On focus, announce the visible label, checkbox role, and current state.
- If using `fieldset` and `legend`, the fieldset should also announce when the checkbox receives focus.
- Examples: "Retirement accounts, checkbox, checked" or "Retirement accounts, checkbox, partially checked."
- On change, announce the change in state.

### ARIA attributes

For checkboxes in an indeterminate or mixed state, use `aria-checked="mixed"`.

## Related

- [Design system overview](../../../README.md)
- [Accessibility standards](../../../specs/standards/accessibility-standards.md)
- [Sizing](../../../specs/style-foundations/sizing.md)
- [Color](../../../specs/style-foundations/colors.md)
