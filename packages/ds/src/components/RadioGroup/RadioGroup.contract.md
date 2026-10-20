<!-- GENERATED from RadioGroup.contract.json by `pnpm --filter ds contracts:build`. Do not edit. -->

# RadioGroup contract

Radio group (Radix RadioGroup) with optional label, microcopy, grouped field and items.

**Only the props, variants and values listed here exist. Do not invent others.**

Spec: [RadioGroup.spec.md](./RadioGroup.spec.md)

Import: `import { RadioGroup } from 'ds'`

## `<RadioGroup.Root>`

Renders `div (Radix RadioGroup.Root)`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `density` | enum | `roomy`, `condensed` |  | Sets data-density on the element; omit to inherit from the nearest ancestor. |

\* required

- Passthrough: `Radix RadioGroup.Root`. value, defaultValue, onValueChange, name, disabled, required, orientation, dir, loop.
- ref: yes; className: merged with component classes
- children: `RadioGroup.Label`, `RadioGroup.Group`, `RadioGroup.Microcopy`

## `<RadioGroup.Label>`

Renders `label (DS Label)`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `requirement` | enum | `required`, `optional` |  | Omit for no suffix. |
| `error` | boolean |  | `false` | Error color. |

\* required

- Passthrough: `Radix Label.Root`. htmlFor etc.
- ref: yes; className: merged with component classes
- children: any

## `<RadioGroup.Group>`

Renders `div`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `density` | enum | `roomy`, `condensed` |  | Sets data-density on the element; omit to inherit from the nearest ancestor. |
| `error` | boolean |  | `false` | Error styling for the group field. |
| `orientation` | enum | `vertical`, `horizontal` | `"vertical"` |  |

\* required

- Passthrough: `ComponentProps<'div'>`
- ref: yes; className: merged with component classes
- children: `RadioGroup.Item`

## `<RadioGroup.Item>`

Renders `RadioButton`. Alias of RadioButton.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `children` | node |  |  | Row label text. |
| `value` * | string |  |  | Item value. |

\* required

- Passthrough: `Radix RadioGroup.Item` — omits `children`
- ref: yes; className: merged with component classes
- children: any

## `<RadioGroup.Microcopy>`

Renders `p (DS Microcopy)`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `error` | boolean |  | `false` | Error color. |

\* required

- Passthrough: `ComponentProps<'p'>`
- ref: yes; className: merged with component classes
- children: any

## Constraints

- **composition** (`RadioGroup.Item`): Items go inside RadioGroup.Group inside RadioGroup.Root.

## Not supported

- per-item error prop (use Group error).
