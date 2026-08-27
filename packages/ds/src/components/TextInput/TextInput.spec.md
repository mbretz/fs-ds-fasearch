---
title: 'TextInput'
---

# TextInput

Text inputs are interactive controls for accepting and editing data.

## Guidelines

Typing can often be the most efficient method of entry. Use this component when precision matters or when possible options are not easily represented by a small fixed list.

- Keep labels concise and sentence-style so they clearly describe the field purpose.
- Clearly distinguish required and optional fields. Use an asterisk before required labels and include "(optional)" for optional fields.
- Mask external customer account numbers in customer-facing communications, showing only the last five digits.
- Use hyphens in phone number formats for readability, and use input masks when needed.
- Keep labels simple and relevant. Avoid long labels and colons.
- For date and amount inputs, omit the words "date" and "amount" when they are implied by context or field type.

## Accessibility

### Keyboard controls

| Key | Behavior                                                 |
| --- | -------------------------------------------------------- |
| Tab | Moves focus into the input unless disabled or read-only. |
| Tab | Moves focus away from the input.                         |

### Focus management

Focus remains in the text input until the user navigates away.

### Screen reader behavior

On focus, announce the visible label, edit role, and existing content. Associated text such as microcopy or error messages, and states such as required, disabled, or invalid, should also announce.

Examples: "Last Name, edit. Smith. Max length is 24 characters. Type in text." or "Pizza topping preferences, edit, invalid entry. Pineapple. Please choose a valid pizza topping."

### ARIA attributes

- `aria-describedby`: associate the input with related microcopy and error messages.
- `aria-required="true"`: indicate a required field.
- `aria-invalid="true"`: indicate an invalid state. Include an error message explaining how to correct the issue.

## Related

- [Design system overview](../../../README.md)
- [Accessibility standards](../../../specs/standards/accessibility-standards.md)
- [Sizing](../../../specs/style-foundations/sizing.md)
- [Color](../../../specs/style-foundations/colors.md)
