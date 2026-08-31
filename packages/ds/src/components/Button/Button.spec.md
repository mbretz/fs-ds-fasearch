---
title: 'Button'
---

# Button

A button triggers an action such as submitting a form or showing/hiding an interface component. If the element navigates the user to another place on the same page or to a different page, use a link instead.

## Guidelines

### Button label principles

Button labels are of critical importance in screen design. Users focus on buttons above all other content to seek quick action. The user should feel confident clicking on the button and understanding the outcome based on the label.

- **Keep it simple.** Buttons should express the action to be taken in its simplest form. Buttons are functional, practical devices that help the user get a job done — wherever possible, the design should get out of the way.
- **Be context specific.** Avoid ambiguity, and recite the context within which an action is being taken. Refrain from using ambiguous labels such as "Yes" or "No". Instead, labels should describe the action being taken — e.g. "Delete [the name of the object]" rather than a bare "Delete".

### Button order & positioning

Secondary actions should be positioned to the left and primary actions to the right. When grouped with primary and secondary actions, tertiary actions should be placed furthest to the left. For instance, when the primary action is Continue and the secondary action is Go Back, other actions, such as Cancel, should have less emphasis and use a tertiary button.

Some exceptions may apply depending on the platform: Apple's macOS guidance places the button that initiates an action furthest to the right, with Cancel to its left. Android's Material guidance places the dismissive action (returns the user to the previous state) on the left and the affirmative action (continues progress toward the user's goal) on the right — so on both platforms Cancel ends up to the left of Continue, but for different reasons.

### Button quantity & alternatives

- Limit quantity: restrict the number of buttons in a set to a maximum of three. For situations demanding four or more options, consider alternative design approaches, such as a split button, radio buttons, or a select option list.
- Don't use "Proceed" as a button label.
- Don't use "Yes" or "No" as button labels.

### Standard labels

| Standard label   | Use case                                                                                                                          |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Cancel            | Default — a planned action should not take place.                                                                                 |
| Dismiss           | When "Cancel" is contextually inappropriate, e.g., cancel an appointment vs. dismiss the calendar edit.                          |
| Delete [Object]   | Data will be immediately destroyed. Present the user with a confirmation dialog if the destruction could be severe. Be explicit about what will be deleted. |
| Save              | Content changes made within the current context will persist in a database.                                                      |
| Save & Continue   | Content changes are saved, but there are more steps to complete beyond the current context.                                      |
| Save & Complete   | Content changes are saved, but there are more steps to complete beyond the current context at a future time.                     |
| Edit              | Data is available for editing.                                                                                                    |
| Update            | Changes only persist on-screen; nothing is committed to the database. Progress is lost if a user leaves context.                 |
| Submit            | Used as the final commit for the task or process. Data will be sent to a recipient destination. Do not use if there are more steps. |
| Print             | Triggers a print options dialog or print preview.                                                                                 |
| Print Preview     | Triggers the creation of a PDF of the print preview.                                                                              |
| Send to Printer   | Immediately delivers a request to a printer, without bringing up a print options dialog or print preview.                        |
| Sign Up           | Product-specific — use "Sign Up," not "enroll," when referring to a customer portal or other online services.                    |

### Variants

Primary buttons, or filled buttons, indicate the most relevant action on a page, generally those aligned to the primary workflow. Avoid using primary buttons for irreversible or potentially harmful actions like Delete — opt for a destructive button instead.

Secondary buttons, or outlined buttons, are ideal for actions related to alternative workflows or actions.

Tertiary buttons, or label-only buttons, are ideal for actions that are uncommon, or where emphasis would be inappropriate. See the tertiary button note under Accessibility below.

Including icons can enhance scan-ability, particularly when actions are listed or have similar verbiage, and can reinforce the meaning of the action, reducing potential ambiguity.

Reversed buttons are specifically used in conjunction with an application's title bar, and not in other contexts.

Destructive buttons are for operations that modify, delete, or otherwise irreversibly change data or system states. Their representation should be handled with care to prevent unintended consequences:

- **Clarity in labeling.** Destructive buttons should have clear, explicit labels such as "Delete [Filename.ext]" or "Remove [entity]". Avoid vague or general labels.
- **Confirmation step.** Always include a confirmation step before executing the destructive action — a simple dialog box asking the user to confirm.
- **Undo option.** Whenever feasible, provide an undo option immediately after the destructive action has been carried out, as a safeguard against accidental deletions or modifications.
- **Positioning.** Position destructive buttons logically and consistently, preferably separate from the main flow of user interaction to minimize the chance of accidental clicks.

Condensed buttons are a variant for screens with limited real estate. They fit well on very information-dense pages while still meeting basic usability guidelines. Standard-size buttons are still preferred where possible, but condensed buttons are available for primary, secondary, and tertiary stylings (and a condensed split button) when needed; their height matches condensed input fields.

### Close buttons

Close buttons live on the top-right corner of a modal or alert. They are always on the top right of a closable modal, such as Dialog, Feedback, Date picker, or Wizard, or other similar function.

Close buttons are not to be used for destructive actions — consider a destructive button instead. For removing objects from lists or tables, use an object-subtract icon instead.

The close button has both standard and condensed variants. Condensed variants can be used where screen real estate is in low supply; the standard component should be used when possible, as it creates more breathing room.

### Disabled buttons should be avoided

Although disabled buttons are provided for pragmatic reasons, as a rule they should be avoided. A disabled button is an element that appears on the interface but does not allow interaction, which goes against usability principles because:

- It fails to provide users with clear feedback on why an action is unavailable.
- It creates unnecessary friction by displaying non-functional elements.
- It does not support accessibility best practices, as disabled elements cannot be easily navigated by assistive technology.

Instead of disabling buttons, consider:

- **Providing contextual feedback** — explain why an action is unavailable rather than disabling the button.
- **Using progressive disclosure** — hide or replace the button with a message guiding the user to the next steps.
- **Offering alternative actions** — allow the user to adjust their input to meet the conditions necessary for the action.

If a disabled button must be used, it must use `aria-disabled="true"` instead of the HTML `disabled` attribute, and its text/icon should still have a 3:1 contrast ratio against the button background. Disabled buttons are not recommended for form submission — the button should remain active and use error handling to guide users instead. An exception is pagination, where a "First" or "Last" button may be disabled at the edge of the range.

## Accessibility

This section focuses on buttons as individual components rather than those that are part of a larger component or pattern. If the button is part of a larger component, refer to that component's accessibility section for guidance specific to that component (e.g. Dialog, date picker, collapsible card).

### Design considerations

- Button text or icon color must have a 4.5:1 contrast ratio against the button background color.
- Button background color should have a 3:1 contrast ratio against its underlying page.
- Buttons should not be styled to look like links (e.g. blue text with an underline).

### Code requirements

- Buttons should use the semantic HTML `<button>` element.
- If the button is within a form, it should use `<input type="button">` or `<input type="submit">`.
- If none of the above is possible, a custom button must include:
  - `role="button"`
  - `tabindex="0"`
  - `onClick`: scripted handling for activation via mouse click or touch.
  - `onKeyDown`: scripted handling for activation via the Enter or Space key.

### Tertiary button note

Because tertiary buttons do not have a background color or border, it can be difficult for a sighted user to determine from looking at the button alone that it is actionable. If they cannot discern the color of the button text, they will have to rely on other clues, such as the actual text used and the placement of the button.

Using a tertiary button in the following ways helps a user understand that it is actionable, and not just text:

- Use an action word like "Cancel" while pairing the tertiary button with secondary and primary buttons.
- Group tertiary buttons together in the header or footer of the page, where one might expect to find actionable content.
- Use an icon with the text, such as a pencil icon and the word "Edit".

### Keyboard controls

| Key             | Behavior                            |
| --------------- | ------------------------------------ |
| Tab             | Moves focus to the button.          |
| Enter or Space  | Activates the button.               |
| Tab             | Moves focus away from the button.   |

### Focus management

- In general, if a user activates a button and remains on the same page with the button still present, focus should remain on the button — e.g. an "Update results" button or a button that changes the sorting order of a list.
- If the button triggers a process or action, such as submitting a form or calculating a result, focus should move to the new section or page. If something is being processed, focus should stay on the button until processing completes.

### Screen reader behavior

On focus, the screen reader should announce any visible button text, followed by any visually hidden text (if present), and the role "button". It may also announce other state information, such as disabled or pressed.

**Name, Role, Value:**

- Name: visible text plus any visually hidden text.
- Role: "button".
- Value: depending on the button's function, state information such as "expanded".

Example: "Save changes, button."

### ARIA attributes

**`aria-label`** — if the button label is paired with icons, prefer screen-reader-only text where possible; in that case no ARIA is required. Where screen-reader-only text isn't possible, include a meaningful `aria-label`:

```html
aria-label="sort by name, high to low"
```

`aria-label` overrides any visible button text for assistive technology users, which can make it harder for someone relying on the onscreen text to navigate to or identify the button — use it only when needed.

**`role="button"`** — avoid using non-button elements as buttons where possible, since that requires adding the role and emulating native keyboard/click behavior in JavaScript. A native `<button>` element already has the required semantics and behavior built in.

**Other attributes** — depending on the button's functionality, attributes such as `aria-expanded` or `aria-pressed` may be needed to communicate current state to screen reader users.

## Related

- [Design system overview](../../../README.md)
- [Accessibility standards](../../../specs/standards/accessibility-standards.md)
- [Sizing](../../../specs/style-foundations/sizing.md)
- [Color](../../../specs/style-foundations/colors.md)
