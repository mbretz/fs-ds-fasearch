---
title: 'TextArea'
---

# TextArea

Text area inputs support multi-sentence input.

## Guidelines

- Keep labels concise and sentence-style so they clearly describe the field purpose.
- Clearly distinguish required and optional fields. Use an asterisk before required labels and include "(optional)" for optional fields.
- Mask external customer account numbers in customer-facing communications, showing only the last five digits.
- Use hyphens in phone number formats for readability, and use input masks when needed.
- Keep labels simple and relevant. Avoid long labels and colons.
- For date and amount inputs, omit the words "date" and "amount" when they are implied by context or field type.

## Variants

- Text input
- Number input
- Masked input
- Text area
- Disabled field
- Error with microcopy
- Character counter

Using a max-length character counter helps users understand the typed length and limit. Error messages should explain how to fix invalid input and replace helper text until the error is resolved.

## Accessibility

### Keyboard controls

| Key | Behavior                                                 |
| --- | -------------------------------------------------------- |
| Tab | Moves focus into the input unless disabled or read-only. |
| Tab | Moves focus away from the input.                         |

### Focus management

Focus remains in the input until the user navigates away.

### Screen reader behavior

On focus, announce the visible label, edit role, and existing content. Associated text such as microcopy or error messages, and states such as required, disabled, or invalid, should also announce.

Examples: "Last Name, edit. Smith. Max length is 24 characters. Type in text." or "Pizza topping preferences, edit, invalid entry. Pineapple. Please choose a valid pizza topping."

### ARIA attributes

- `aria-invalid="true"`: set automatically by `TextArea.Field` whenever `error` is `true`.
- `aria-required="true"`: set automatically by `TextArea.Field` whenever the native `required` prop is set.
- `aria-describedby`: **not** wired automatically — `TextArea.Label`, `TextArea.Field`, and `TextArea.Microcopy` render as independent sibling elements with no shared context linking their ids, the same way `Label`'s `htmlFor` must already be paired manually with `Field`'s `id`. Give `TextArea.Microcopy` (and any error text) an `id`, then pass `aria-describedby` on `TextArea.Field` pointing at it.

## Related

- [Design system overview](../../../README.md)
- [Accessibility standards](../../../specs/standards/accessibility-standards.md)
- [Sizing](../../../specs/style-foundations/sizing.md)
- [Color](../../../specs/style-foundations/colors.md)
