---
title: 'SearchInput'
---

# SearchInput

SearchInput is a filter component that uses a text query to discover results.

## Guidelines

1. Always provide helper text below the search field to describe what data can be searched.
2. Size the input according to the expected query length.
3. Keep search in its intended context: filtering content. It is not a standard text input or autocomplete field.

## Behavior

A Search input lets users search pages or content, or search content on the current page when paired with a filter component. Search components often appear near the top of a page, below the header bar and above the page title.

Submitting the field takes the user to a search results page for site-wide search or refines the current list for local filtering. Search may include optional autocomplete suggestions.

## Accessibility

### Keyboard controls

| Key                    | Behavior                                                                                                        |
| ---------------------- | --------------------------------------------------------------------------------------------------------------- |
| Tab                    | Moves focus into the search text field.                                                                         |
| Enter                  | Performs the search when focus is in the text field.                                                            |
| Down Arrow or Up Arrow | When suggestions are displayed, moves focus to the first or last suggestion and cycles through the list.        |
| Spacebar or Enter      | Selects the focused suggestion, closes the list, and performs the search.                                       |
| Tab                    | Moves focus back to the text field without selecting a suggestion, or from the text field to the Search button. |
| Enter or Spacebar      | Activates the focused Search button.                                                                            |

### Screen reader behavior

- On focus, announce the visible label, edit-combo role, existing value, associated text, and state.
- Example: "Search, edit combo, collapsed. Search the site. To set the value use the Arrow keys or type the value."
- As the user types, announce when suggestions become available and provide navigation instructions.
- As the user moves through suggestions, announce the list context, visible text, and item position.

## Related

- [Design system overview](../../../README.md)
- [Accessibility standards](../../../specs/standards/accessibility-standards.md)
- [Elevation](../../../specs/style-foundations/elevation.md)
