---
title: 'Dialog'
---

# Dialog

A dialog is a modal interaction that temporarily takes over the main window and requires user input before continuing the application flow.

## Guidelines

Dialogs temporarily halt interaction with the main application. Because they interrupt workflow, use them judiciously.

### Recommended practices

- Provide closure options such as Cancel, Close, Escape, or clicking outside the dialog.
- Use descriptive titles that clearly indicate the expected user action.
- Place dialogs in the upper half of the screen and avoid full-screen treatment unless necessary.
- Use a scrim to indicate the main page is temporarily inactive.
- Use clear, action-oriented button labels.

### Practices to avoid

- Do not layer dialogs or place tooltips in dialogs.
- Do not show unexpected popups that were not triggered by user action.
- Do not use dialogs as a substitute for well-designed workflows or multi-step processes.
- Avoid displaying extensive tables or important forms in dialogs.

### Considerations

- Who is intended to interact with this dialog?
- What action is the user expected to take?
- When will the dialog appear, and will it disrupt the user?
- Where will the dialog appear?
- Why is a dialog necessary instead of incorporating the content into the main page?

## Accessibility

### Keyboard controls

| Key          | Behavior                                                                                                |
| ------------ | ------------------------------------------------------------------------------------------------------- |
| Dialog opens | Place keyboard focus on the dialog's built-in close button, not generically "the first focusable element" — deliberate and tested (`Dialog.tsx`/`Dialog.test.tsx`), so focus lands somewhere predictable regardless of what content a consumer puts in the body. |
| Tab          | Moves focus to the next focusable element inside the dialog; wraps to the first item from the last.     |
| Shift + Tab  | Moves focus to the previous focusable element inside the dialog; wraps to the last item from the first. |
| Esc          | Closes the dialog and returns focus to the element that launched it.                                    |

### Focus management

- Trap keyboard and screen reader focus within the dialog while it is open.
- When the dialog closes, return focus to the last focused element before opening.

### Screen reader behavior

On activation, announce the dialog title and focused element. Example: "Add address dialog, street, edit, blank."

### ARIA attributes

On the dialog container, include:

- `role="dialog"`
- `aria-labelledby="[title id]"`
- `aria-modal="true"`

For broader support, include the following on the page container while the dialog is open:

- `aria-hidden="true"`
- `tabindex="-1"`

## Related

- [Design system overview](../../../README.md)
- [Accessibility standards](../../../specs/standards/accessibility-standards.md)
- [Elevation](../../../specs/style-foundations/elevation.md)
- [Spacing](../../../specs/style-foundations/spacing.md)
