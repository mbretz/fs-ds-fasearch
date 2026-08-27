---
title: 'SelectInput'
---

# SelectInput

Select inputs present a list of options in a compact form control.

## Guidelines

- Use initial caps for options.
- Use alphabetical ordering.
- Limit to a maximum of 15 options.

## Variants

- Required
- Optional
- Disabled
- Disabled option
- Error with microcopy
- Microcopy
- Condensed
- Hidden label
- Pre-selected option

## Accessibility

### Keyboard controls

These are expected behaviors for this custom Select component on a PC. Mac users may experience variations.

| Key                            | Behavior                                                                                                                 |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Tab                            | Moves focus to the Select input.                                                                                         |
| Enter, Spacebar, or Down Arrow | Opens the dropdown and places focus on the selected item, or the first item if no value is selected.                     |
| Up or Down Arrow               | Navigates choices in the open dropdown; the active selection changes as the user arrows through the list.                |
| Enter                          | Closes the menu and keeps the focused item as the active selection.                                                      |
| Esc                            | Closes the menu and keeps the focused item as the active selection.                                                      |
| Tab                            | Moves focus away from the Select input; if open, the dropdown closes and keeps the focused item as the active selection. |

### Screen reader behavior

- On focus, announce the input label, control type, and current value. Example: "Choose a vehicle, combo box, jeep."
- In the dropdown, announce the list, selected/highlighted value, and number of options. Example: "List box, Jeep, 3 of 4."

### Disabled options

Disabled options inside a select input are difficult for screen reader users to discover. Avoid disabled options and consider alternative ways to communicate unavailable choices.

### Labels

Visible labels should match the label used by assistive technology. If additional information is needed, use `aria-describedby` to associate on-screen information with the control. Avoid using `aria-label` to replace the visible label because it can make speech recognition difficult.

### Needs improvement

This component has known accessibility issues on the backlog, including:

- The keyboard focus indicator of the open input does not show in Windows High Contrast Mode.
- More exploration is needed around disabled options in the dropdown list.
- The expanded/collapsed state is not properly announced after a choice is made.

## Related

- [Design system overview](../../../README.md)
- [Accessibility standards](../../../specs/standards/accessibility-standards.md)
- [Elevation](../../../specs/style-foundations/elevation.md)
- [Sizing](../../../specs/style-foundations/sizing.md)
- [Color](../../../specs/style-foundations/colors.md)
