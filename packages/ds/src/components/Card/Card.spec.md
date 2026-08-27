---
title: 'Card'
---

# Card

A card is a versatile component for displaying content such as informational, introductory, instructional, and next-step material.

## Guidelines

- Keep card titles concise and descriptive.
- Avoid using cards for substantial content blocks.
- Use cards sparingly so the common-region grouping remains meaningful.

## Variants

### Standard card

Use a standard card for concise grouped content.

### Collapsible card

Collapsible cards use progressive disclosure to present large amounts of content in a small space. They work especially well on mobile interfaces or wherever vertical space is limited. A chevron indicates the expand/collapse action, though the entire header area should trigger the same action.

### Collapsible usage guidelines

- Ensure the entire header row is clickable and triggers expand/collapse.
- Do not nest collapsible content.
- Do not place more than one clickable area in the collapsible header.

## Accessibility

This section focuses on the card itself. For components contained inside a card, refer to the accessibility guidance for those components.

### Keyboard controls

| Key            | Behavior                                                                                                                                                                               |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tab            | Moves focus to the title bar/button for the collapsible card.                                                                                                                          |
| Enter or Space | Toggles the expanded or collapsed state.                                                                                                                                               |
| Tab            | Moves focus away from the title bar/button. If expanded and actionable content exists, focus moves into the card body; otherwise it moves to the next focusable item outside the card. |

### Focus management

For the collapsible variant, retain keyboard focus on the title bar/button when it is pressed.

### Screen reader behavior

- On focus, announce the title bar/button label, role, and state. Example: "June 2000, button, expanded."
- On state change, announce "collapsed" or "expanded."
- If the card is collapsed, screen readers should not announce content contained in the collapsed panel.

### ARIA attributes

On the collapsible button, include:

- `aria-expanded="true"` or `aria-expanded="false"`
- `aria-controls="[collapsed card ID]"`

Optionally, assign individual content panels `role="region"` and associate them with their header using `aria-labelledby`.

### Improvement possible

This component has opportunities for accessibility improvements on the backlog, including:

- The chevron is right-aligned far from the card heading, which can be difficult for some screen magnification users.
- Some users mistakenly believe the chevron itself must be clicked.
- The structure and focus order of the title bar should be adjusted for better screen reader support.

## Related

- [Design system overview](../../../README.md)
- [Accessibility standards](../../../specs/standards/accessibility-standards.md)
- [Surfaces](../../../specs/style-foundations/surfaces.md)
- [Spacing](../../../specs/style-foundations/spacing.md)
- [Color](../../../specs/style-foundations/colors.md)
