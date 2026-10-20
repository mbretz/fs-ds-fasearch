<!-- GENERATED from TextInput.contract.json by `pnpm --filter ds contracts:build`. Do not edit. -->

# TextInput contract

Labelled single-line field with optional start/end icons. Compose Root + Label + Field + Microcopy.

**Only the props, variants and values listed here exist. Do not invent others.**

Spec: [TextInput.spec.md](./TextInput.spec.md)

Import: `import { TextInput, textInputFieldVariants } from 'ds'`

## `<TextInput.Root>`

Renders `div`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `density` | enum | `roomy`, `condensed` |  | Sets data-density on the element; omit to inherit from the nearest ancestor. |

\* required

- Passthrough: `ComponentProps<'div'>`
- ref: yes; className: merged with component classes
- children: `TextInput.Label`, `TextInput.Field`, `TextInput.Microcopy`

## `<TextInput.Label>`

Renders `label (DS Label)`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `requirement` | enum | `required`, `optional` |  | Omit for no suffix. |
| `error` | boolean |  | `false` | Error color. |

\* required

- Passthrough: `Radix Label.Root`. htmlFor etc.
- ref: yes; className: merged with component classes
- children: any

## `<TextInput.Field>`

Renders `input`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `error` | boolean |  | `false` | Error state. |
| `iconStart` | node |  |  | Inline-start icon. |
| `iconEnd` | node |  |  | Inline-end icon (decorative, aria-hidden). |
| `density` | enum | `roomy`, `condensed` |  | Sets data-density on the element; omit to inherit from the nearest ancestor. |

\* required

- Passthrough: `ComponentProps<'input'>` — omits `size`
- ref: yes; className: merged with component classes
- children: any

## `<TextInput.Microcopy>`

Renders `p (DS Microcopy)`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `error` | boolean |  | `false` | Error color. |

\* required

- Passthrough: `ComponentProps<'p'>`
- ref: yes; className: merged with component classes
- children: any

## Constraints

- **a11y**: Pair Label and Field via htmlFor/id; link Microcopy with aria-describedby.
- **usage**: Disabled takes visual precedence over error and read-only.

## Not supported

- size prop.
- interactive iconEnd (use SearchInput for that).
