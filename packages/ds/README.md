# ds

Radix-style design system driven by Figma-authored tokens (`tokens`). Radix UI Primitives + `class-variance-authority` + Tailwind v4, styled entirely from the `tokens` package's CSS custom properties.

## Usage

```ts
import { Dialog } from 'ds';
import 'ds/src/theme.css'; // once, ahead of any component usage
```

## Specs

[`specs/`](./specs/README.md) holds cross-cutting UX, accessibility, and content guidance not tied to a single component (accessibility standards, color/spacing/elevation rationale, etc). A component's own acceptance criteria and accessibility contract live colocated with it instead — see the table below.

## Component contracts

Every component has a machine-checked API contract: [`<Name>.contract.json`](./src/components/Button/Button.contract.json) is the source of truth (parts, props, enum values, defaults, composition rules, what is _not_ supported), and a readable `<Name>.contract.md` is generated from it. Everything is also aggregated in [`contracts/contracts.json`](./contracts/contracts.json). Consumers and coding agents should use only what a contract lists — see [`AGENTS.md`](./AGENTS.md).

- `pnpm --filter ds contracts:build` regenerates the `.md` files and the aggregate.
- `pnpm --filter ds test` fails if a contract disagrees with the code (props, enum values, cva variants/defaults, exports) or if a generated file is stale.

## Components

| Component        | Spec                                                                                   | Contract                                                                                       |
| ---------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Avatar           | [Avatar.spec.md](./src/components/Avatar/Avatar.spec.md)                               | [Avatar.contract.md](./src/components/Avatar/Avatar.contract.md)                               |
| Box              | —                                                                                      | [Box.contract.md](./src/components/Box/Box.contract.md)                                        |
| Button           | [Button.spec.md](./src/components/Button/Button.spec.md)                               | [Button.contract.md](./src/components/Button/Button.contract.md)                               |
| Card             | [Card.spec.md](./src/components/Card/Card.spec.md)                                     | [Card.contract.md](./src/components/Card/Card.contract.md)                                     |
| Checkbox         | [Checkbox.spec.md](./src/components/Checkbox/Checkbox.spec.md)                         | [Checkbox.contract.md](./src/components/Checkbox/Checkbox.contract.md)                         |
| ChecklistGroup   | —                                                                                      | [ChecklistGroup.contract.md](./src/components/ChecklistGroup/ChecklistGroup.contract.md)       |
| Chip             | —                                                                                      | [Chip.contract.md](./src/components/Chip/Chip.contract.md)                                     |
| CloseButton      | —                                                                                      | [CloseButton.contract.md](./src/components/CloseButton/CloseButton.contract.md)                |
| Dialog           | [Dialog.spec.md](./src/components/Dialog/Dialog.spec.md)                               | [Dialog.contract.md](./src/components/Dialog/Dialog.contract.md)                               |
| FilterMenu       | [FilterMenu.spec.md](./src/components/FilterMenu/FilterMenu.spec.md)                   | [FilterMenu.contract.md](./src/components/FilterMenu/FilterMenu.contract.md)                   |
| Grid             | —                                                                                      | [Grid.contract.md](./src/components/Grid/Grid.contract.md)                                     |
| Label            | —                                                                                      | [Label.contract.md](./src/components/Label/Label.contract.md)                                  |
| Link             | —                                                                                      | [Link.contract.md](./src/components/Link/Link.contract.md)                                     |
| LinkHelp         | [LinkHelp.spec.md](./src/components/LinkHelp/LinkHelp.spec.md)                         | [LinkHelp.contract.md](./src/components/LinkHelp/LinkHelp.contract.md)                         |
| LinkNavigation   | —                                                                                      | [LinkNavigation.contract.md](./src/components/LinkNavigation/LinkNavigation.contract.md)       |
| Microcopy        | —                                                                                      | [Microcopy.contract.md](./src/components/Microcopy/Microcopy.contract.md)                      |
| RadioButton      | —                                                                                      | [RadioButton.contract.md](./src/components/RadioButton/RadioButton.contract.md)                |
| RadioGroup       | [RadioGroup.spec.md](./src/components/RadioGroup/RadioGroup.spec.md)                   | [RadioGroup.contract.md](./src/components/RadioGroup/RadioGroup.contract.md)                   |
| Scrim            | —                                                                                      | [Scrim.contract.md](./src/components/Scrim/Scrim.contract.md)                                  |
| ScrollArea       | —                                                                                      | [ScrollArea.contract.md](./src/components/ScrollArea/ScrollArea.contract.md)                   |
| SearchInput      | [SearchInput.spec.md](./src/components/SearchInput/SearchInput.spec.md)                | [SearchInput.contract.md](./src/components/SearchInput/SearchInput.contract.md)                |
| SegmentedControl | [SegmentedControl.spec.md](./src/components/SegmentedControl/SegmentedControl.spec.md) | [SegmentedControl.contract.md](./src/components/SegmentedControl/SegmentedControl.contract.md) |
| SelectInput      | [SelectInput.spec.md](./src/components/SelectInput/SelectInput.spec.md)                | [SelectInput.contract.md](./src/components/SelectInput/SelectInput.contract.md)                |
| Separator        | —                                                                                      | [Separator.contract.md](./src/components/Separator/Separator.contract.md)                      |
| Stack            | —                                                                                      | [Stack.contract.md](./src/components/Stack/Stack.contract.md)                                  |
| Tabs             | —                                                                                      | [Tabs.contract.md](./src/components/Tabs/Tabs.contract.md)                                     |
| Tag              | [Tag.spec.md](./src/components/Tag/Tag.spec.md)                                        | [Tag.contract.md](./src/components/Tag/Tag.contract.md)                                        |
| TextArea         | [TextArea.spec.md](./src/components/TextArea/TextArea.spec.md)                         | [TextArea.contract.md](./src/components/TextArea/TextArea.contract.md)                         |
| TextInput        | [TextInput.spec.md](./src/components/TextInput/TextInput.spec.md)                      | [TextInput.contract.md](./src/components/TextInput/TextInput.contract.md)                      |

Components without a spec yet simply don't have written UX/accessibility guidance — not an indication they're unfinished.
