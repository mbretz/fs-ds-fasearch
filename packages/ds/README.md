# ds

Radix-style design system driven by Figma-authored tokens (`tokens`). Radix UI Primitives + `class-variance-authority` + Tailwind v4, styled entirely from the `tokens` package's CSS custom properties.

## Usage

```ts
import { Dialog } from 'ds';
import 'ds/src/theme.css'; // once, ahead of any component usage
```

## Specs

[`specs/`](./specs/README.md) holds cross-cutting UX, accessibility, and content guidance not tied to a single component (accessibility standards, color/spacing/elevation rationale, etc). A component's own acceptance criteria and accessibility contract live colocated with it instead — see the table below.

## Components

| Component        | Spec                                                                                   |
| ---------------- | -------------------------------------------------------------------------------------- |
| Avatar           | [Avatar.spec.md](./src/components/Avatar/Avatar.spec.md)                               |
| Button           | —                                                                                      |
| Card             | [Card.spec.md](./src/components/Card/Card.spec.md)                                     |
| Checkbox         | [Checkbox.spec.md](./src/components/Checkbox/Checkbox.spec.md)                         |
| ChecklistGroup   | —                                                                                      |
| Chip             | —                                                                                      |
| CloseButton      | —                                                                                      |
| Dialog           | [Dialog.spec.md](./src/components/Dialog/Dialog.spec.md)                               |
| FilterMenu       | [FilterMenu.spec.md](./src/components/FilterMenu/FilterMenu.spec.md)                   |
| Label            | —                                                                                      |
| Link             | —                                                                                      |
| LinkHelp         | [LinkHelp.spec.md](./src/components/LinkHelp/LinkHelp.spec.md)                         |
| LinkNavigation   | —                                                                                      |
| Microcopy        | —                                                                                      |
| RadioButton      | —                                                                                      |
| RadioGroup       | [RadioGroup.spec.md](./src/components/RadioGroup/RadioGroup.spec.md)                   |
| Scrim            | —                                                                                      |
| SearchInput      | [SearchInput.spec.md](./src/components/SearchInput/SearchInput.spec.md)                |
| SegmentedControl | [SegmentedControl.spec.md](./src/components/SegmentedControl/SegmentedControl.spec.md) |
| SelectInput      | [SelectInput.spec.md](./src/components/SelectInput/SelectInput.spec.md)                |
| Separator        | —                                                                                      |
| Tabs             | —                                                                                      |
| Tag              | [Tag.spec.md](./src/components/Tag/Tag.spec.md)                                        |
| TextArea         | [TextArea.spec.md](./src/components/TextArea/TextArea.spec.md)                         |
| TextInput        | [TextInput.spec.md](./src/components/TextInput/TextInput.spec.md)                      |

Components without a spec yet simply don't have written UX/accessibility guidance — not an indication they're unfinished.
