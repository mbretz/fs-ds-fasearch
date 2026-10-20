<!-- GENERATED from Chip.contract.json by `pnpm --filter ds contracts:build`. Do not edit. -->

# Chip contract

Small dismissible/non-dismissible pill. Flat Chip wrapper or composed Root + Label + CloseButton.

**Only the props, variants and values listed here exist. Do not invent others.**

Import: `import { Chip } from 'ds'`

## `<Chip>`

Renders `span`. Convenience wrapper.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `children` * | node |  |  | Label. |
| `onDismiss` | function |  |  | Renders the close button when present. |
| `dismissLabel` | string |  | `"Remove"` | Accessible name for the dismiss button. |
| `asChild` | boolean |  |  | Render the child element instead of the default element (Radix Slot). |

\* required

- Passthrough: `ComponentProps<'span'>`
- ref: yes; className: merged with component classes
- children: any

## `<Chip.Root>`

Renders `span`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `asChild` | boolean |  |  | Render the child element instead of the default element (Radix Slot). |

\* required

- Passthrough: `ComponentProps<'span'>`
- ref: yes; className: merged with component classes
- children: `Chip.Label`, `Chip.CloseButton`

## `<Chip.Label>`

Renders `span`.

No component-specific props.

- Passthrough: `ComponentProps<'span'>`
- ref: yes; className: merged with component classes
- children: any

## `<Chip.CloseButton>`

Renders `button`.

No component-specific props.

- Passthrough: `ComponentProps<'button'>`. onClick is the dismiss hook; set aria-label yourself.
- ref: yes; className: merged with component classes
- children: none

## Constraints

- **a11y** (`Chip.CloseButton`): Chip.CloseButton needs an aria-label when composed directly.

## Not supported

- density / size / variant props (single style).
- leading icon or count on the flat Chip (compose Root/Label/CloseButton for that).
