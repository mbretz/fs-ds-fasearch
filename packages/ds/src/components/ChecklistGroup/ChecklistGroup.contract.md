<!-- GENERATED from ChecklistGroup.contract.json by `pnpm --filter ds contracts:build`. Do not edit. -->

# ChecklistGroup contract

Vertical grouping of Checkbox items with optional error state and nested sub-groups.

**Only the props, variants and values listed here exist. Do not invent others.**

Import: `import { ChecklistGroup } from 'ds'`

## `<ChecklistGroup.Root>`

Renders `div`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `density` | enum | `roomy`, `condensed` |  | Sets data-density on the element; omit to inherit from the nearest ancestor. |

\* required

- Passthrough: `ComponentProps<'div'>`
- ref: yes; className: merged with component classes
- children: `ChecklistGroup.Group`, `Label`, `Microcopy`

## `<ChecklistGroup.Group>`

Renders `div`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `density` | enum | `roomy`, `condensed` |  | Sets data-density on the element; omit to inherit from the nearest ancestor. |
| `error` | boolean |  | `false` | Error styling for the group field. |

\* required

- Passthrough: `ComponentProps<'div'>`
- ref: yes; className: merged with component classes
- children: `Checkbox`, `ChecklistGroup.NestedGroup`

## `<ChecklistGroup.Label>`

Renders `label (DS Label)`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `requirement` | enum | `required`, `optional` |  | Omit for no suffix. |
| `error` | boolean |  | `false` | Error color. |

\* required

- Passthrough: `Radix Label.Root`. htmlFor etc.
- ref: yes; className: merged with component classes
- children: any

## `<ChecklistGroup.Item>`

Renders `label > Radix Checkbox.Root (the Checkbox component)`. Alias of Checkbox.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `children` | node |  |  | Row label text. |
| `error` | boolean |  | `false` | Recolors the label text only. |

\* required

- Passthrough: `Radix Checkbox.Root` — omits `children`
- ref: yes; className: merged with component classes
- children: any

## `<ChecklistGroup.Microcopy>`

Renders `p (DS Microcopy)`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `error` | boolean |  | `false` | Error color. |

\* required

- Passthrough: `ComponentProps<'p'>`
- ref: yes; className: merged with component classes
- children: any

## `<ChecklistGroup.NestedGroup>`

Renders `div`. 40px inline indent for sub-items under a parent Checkbox.

No component-specific props.

- Passthrough: `ComponentProps<'div'>`
- ref: yes; className: merged with component classes
- children: `Checkbox`

## Constraints

- **composition** (`ChecklistGroup.NestedGroup`): Group goes inside Root; NestedGroup goes inside Group, after its parent Checkbox.

## Not supported

- orientation prop (vertical only).
