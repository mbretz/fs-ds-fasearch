<!-- GENERATED from TextArea.contract.json by `pnpm --filter ds contracts:build`. Do not edit. -->

# TextArea contract

Labelled multi-line field. Compose Root + Label + Field + Microcopy.

**Only the props, variants and values listed here exist. Do not invent others.**

Spec: [TextArea.spec.md](./TextArea.spec.md)

Import: `import { TextArea, textAreaFieldVariants } from 'ds'`

## `<TextArea.Root>`

Renders `div`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `density` | enum | `roomy`, `condensed` |  | Sets data-density on the element; omit to inherit from the nearest ancestor. |

\* required

- Passthrough: `ComponentProps<'div'>`
- ref: yes; className: merged with component classes
- children: `TextArea.Label`, `TextArea.Field`, `TextArea.Microcopy`

## `<TextArea.Label>`

Renders `label (DS Label)`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `requirement` | enum | `required`, `optional` |  | Omit for no suffix. |
| `error` | boolean |  | `false` | Error color. |

\* required

- Passthrough: `Radix Label.Root`. htmlFor etc.
- ref: yes; className: merged with component classes
- children: any

## `<TextArea.Field>`

Renders `textarea`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `error` | boolean |  | `false` | Error state. |
| `density` | enum | `roomy`, `condensed` |  | Sets data-density on the element; omit to inherit from the nearest ancestor. |

\* required

- Passthrough: `ComponentProps<'textarea'>` — omits `size`
- ref: yes; className: merged with component classes
- children: any

## `<TextArea.Microcopy>`

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

## Not supported

- size prop.
- auto-resize.
