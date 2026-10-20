<!-- GENERATED from RadioButton.contract.json by `pnpm --filter ds contracts:build`. Do not edit. -->

# RadioButton contract

Single radio item (Radix RadioGroup.Item) with label. Must be inside a RadioGroup.Root.

**Only the props, variants and values listed here exist. Do not invent others.**

Import: `import { RadioButton, radioButtonInputVariants, radioButtonLabelVariants } from 'ds'`

## `<RadioButton>`

Renders `button (Radix RadioGroup.Item) in a label row`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `children` | node |  |  | Row label text. |
| `value` * | string |  |  | Item value; required by Radix. |

\* required

- Passthrough: `Radix RadioGroup.Item` — omits `children`
- ref: yes; className: merged with component classes
- children: any

## Constraints

- **composition** (`RadioButton`): Must be inside RadioGroup.Root.
- **requires-prop** (`RadioButton`): value is required.

## Not supported

- standalone use outside a group.
- error prop (error state is on RadioGroup.Group).
