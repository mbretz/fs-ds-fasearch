---
title: 'FilterMenu'
---

# FilterMenu

Filter menus help users refine large data sets based on predefined attributes.

## Guidelines

### Anatomy

When clicked or touched, the filter button reveals or hides the filter menu. When expanded, the filter menu should push content below it downward so the user can continue to see and adjust the data context.

- The default button label is "Show filters"; when expanded, the label changes to "Hide filters." This swap is opt-in, not automatic: pass both `collapsedLabel` and `expandedLabel` to `FilterMenu.Trigger` and it renders/toggles both for you (CSS-only, off the trigger's own open/closed state). Passing plain `children` instead renders fully static, non-swapping content.
- A "Clear" button appears after filters have been applied and clears all selected parameters.
- A small number tag indicates how many parameters are set.
- The filter container expands and collapses like a dropdown.
- The "Apply filters" button applies selected filters to the larger data set.

### Usage guidelines

Use a filter menu when users are navigating large data sets or searching for specific information. Avoid filter menus when the results are consistently short and filtering would add unnecessary complexity.

### Variants

- Clear button outside the filter container
- Clear button inside the filter selection container
- Grid-view sort menu
- Responsive/mobile filter layout

## Accessibility

### Keyboard controls

| Key               | Behavior                                                                                    |
| ----------------- | ------------------------------------------------------------------------------------------- |
| Tab               | Moves focus to the Show Filter or Clear button.                                             |
| Spacebar or Enter | Activates the focused button. Show Filter expands the panel; Clear removes applied filters. |
| Tab               | Moves focus into the expanded filter panel and through its controls.                        |
| Tab               | Moves focus to the Apply Filters button.                                                    |
| Spacebar or Enter | Activates Apply Filters while keeping the panel open.                                       |
| Esc               | Closes the open menu.                                                                       |

### ARIA attributes

Use `aria-expanded` on the Show Filter button and update it according to the panel's current state.

### Needs improvement

This component has known accessibility issues on the backlog, including:

- Gaps in expected keyboard functionality and focus management.
- Unclear label and control associations, especially for screen reader or magnification users.

## References

According to Nielsen Norman Group, truly usable faceted search provides filter categories and filter values that are appropriate, predictable, and free of jargon.

## Related

- [Design system overview](../../../README.md)
- [Accessibility standards](../../../specs/standards/accessibility-standards.md)
- [Elevation](../../../specs/style-foundations/elevation.md)
- [Spacing](../../../specs/style-foundations/spacing.md)
