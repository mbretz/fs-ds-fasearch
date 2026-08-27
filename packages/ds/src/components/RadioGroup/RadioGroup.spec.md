---
title: 'RadioGroup'
---

# RadioGroup

Radio buttons offer mutually exclusive options where the user can select only one choice from a list. This spec covers group-level behavior (keyboard navigation, ARIA roles, screen-reader announcement) — see `RadioButton` for the individual control it composes.

## Variants

- Disabled
- Hide label
- Hidden label (disabled)
- Radio group
- Horizontal radio group
- Radio group error
- Disabled radio group

## Accessibility

### Keyboard controls

| Key        | Behavior                                                                                                                             |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Tab        | Moves focus into the radio group. If a radio button is selected, focus lands there; otherwise focus lands on the first radio button. |
| Arrow keys | Move focus through radio buttons in a loop. As a radio receives focus, it will usually be selected.                                  |
| Spacebar   | Selects the currently focused radio button. Radio buttons cannot be unselected.                                                      |
| Tab        | Moves focus away from the radio group.                                                                                               |

### Focus management

Focus remains on the radio button until the user navigates away.

### Screen reader behavior

- On focus, announce the visible labels, radio button role, and current state.
- If using `fieldset` and `legend`, the fieldset should also announce.
- Example: "Select payment methods, group. Cash on delivery, radio button, not checked."
- On selection, announce the change in state.

### ARIA attributes

Native HTML semantics with `fieldset` and `legend` are preferred. If that is not possible, use:

- `role="radiogroup"` on the parent container
- `aria-labelledby="[legend ID]"` on the parent container
- `role="radio"` on each radio button
- `aria-labelledby="[radio label ID]"` on each radio button
- `aria-checked` on each radio button

## Related

- [Design system overview](../../../README.md)
- [Accessibility standards](../../../specs/standards/accessibility-standards.md)
- [Sizing](../../../specs/style-foundations/sizing.md)
- [Color](../../../specs/style-foundations/colors.md)
