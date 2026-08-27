---
title: 'SegmentedControl'
---

# SegmentedControl

A segmented control displays mutually exclusive options for related content, such as switching between map, transit, and satellite views.

## Guidelines

### Use for toggling views

Segmented controls should be used when users need to choose one option from two or more choices where the same information can be viewed in different formats. Selection changes should activate a new state and provide immediate visual feedback.

### Opt for consistent, short, and clear labels

Labels should be short, direct, clear, and consistent in length. Each segment should have equal width.

### Limit the number of segments

Use a minimum of two segments and a maximum of four. The maximum applies when standalone icons or short labels can clearly represent the segment choices.

### Adapt to screen size

On mobile or condensed screens, segmented controls should span the width of the grid space. On larger screens, width can vary to suit content.

### Avoid for actions, system settings, or form elements

Segmented controls are not intended for performing actions, changing settings, or acting as form elements. They are not substitutes for toggles, radio buttons, or dropdowns.

## Accessibility

For assistive technology users, a segmented control behaves like tabs. The selected state must be visually indicated and must not rely on color alone.

### Keyboard controls

| Key               | Behavior                                                                        |
| ----------------- | ------------------------------------------------------------------------------- |
| Tab               | Moves focus into the segmented control, landing on the currently active option. |
| Left/Right Arrow  | Moves focus through options without automatically activating them (manual activation — deliberate, since segments can show views with expensive or disruptive setup, e.g. a map API call). |
| Enter or Spacebar | Selects (activates) the focused option.                                        |
| Tab               | Moves focus out of the segmented control.                                       |

### Screen reader behavior

Each option should announce the visible text, tab role, position in set, and selected state.

Example: "Weekly, tab, selected, 2 of 3."

### ARIA attributes

On the list of options:

- `role="tablist"`
- `aria-label="[title for tabs]"`

On each option:

- `role="tab"`
- `aria-selected="true"` or `aria-selected="false"`
- `aria-controls="[target tab id]"`

On the tab panel:

- `role="tabpanel"`
- `aria-labelledby="[referring tab id]"`

## Related

- [Design system overview](../../../README.md)
- [Accessibility standards](../../../specs/standards/accessibility-standards.md)
- [Elevation](../../../specs/style-foundations/elevation.md)
