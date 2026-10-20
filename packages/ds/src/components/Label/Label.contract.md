<!-- GENERATED from Label.contract.json by `pnpm --filter ds contracts:build`. Do not edit. -->

# Label contract

Form field label (Radix Label) with required/optional suffix and error color.

**Only the props, variants and values listed here exist. Do not invent others.**

Import: `import { Label, labelTextVariants } from 'ds'`

## `<Label>`

Renders `label (Radix Label.Root)`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `requirement` | enum | `required`, `optional` |  | Omit for no suffix. |
| `error` | boolean |  | `false` | Error color. |

\* required

- Passthrough: `Radix Label.Root`. htmlFor etc. No asChild.
- ref: yes; className: merged with component classes
- children: any

## Constraints

- **usage**: Pair with the control via htmlFor.

## Not supported

- asChild.
- requirement="none" (omit the prop instead).
