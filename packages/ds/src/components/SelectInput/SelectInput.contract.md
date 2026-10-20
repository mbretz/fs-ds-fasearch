<!-- GENERATED from SelectInput.contract.json by `pnpm --filter ds contracts:build`. Do not edit. -->

# SelectInput contract

Labelled select (Radix Select) with trigger states, options and microcopy.

**Only the props, variants and values listed here exist. Do not invent others.**

Spec: [SelectInput.spec.md](./SelectInput.spec.md)

Import: `import { SelectInput, selectInputTriggerVariants } from 'ds'`

## `<SelectInput.Root>`

Renders `div wrapper > Radix Select.Root`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `className` | string |  |  |  |
| `density` | enum | `roomy`, `condensed` |  | Sets data-density on the element; omit to inherit from the nearest ancestor. |

\* required

- Passthrough: `Radix Select.Root`. value, defaultValue, onValueChange, open, onOpenChange, name, disabled, required.
- ref: yes; className: merged with component classes
- children: `SelectInput.Label`, `SelectInput.Trigger`, `SelectInput.Content`, `SelectInput.Microcopy`

## `<SelectInput.Label>`

Renders `label (DS Label)`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `requirement` | enum | `required`, `optional` |  | Omit for no suffix. |
| `error` | boolean |  | `false` | Error color. |

\* required

- Passthrough: `Radix Label.Root`. htmlFor etc.
- ref: yes; className: merged with component classes
- children: any

## `<SelectInput.Trigger>`

Renders `Radix Select.Trigger (button)`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `error` | boolean |  | `false` | Error state. |
| `readOnly` | boolean |  | `false` | Read-only look (disabled interaction). |
| `placeholder` | string |  |  | Shown when no value. |
| `density` | enum | `roomy`, `condensed` |  | Sets data-density on the element; omit to inherit from the nearest ancestor. |

\* required

- Passthrough: `Radix Select.Trigger`
- ref: yes; className: merged with component classes
- children: any

## `<SelectInput.Content>`

Renders `Radix Select.Content in a Portal`. Portal-rendered; density defaults to roomy.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `density` | enum | `roomy`, `condensed` |  | Defaults to roomy. |

\* required

- Passthrough: `Radix Select.Content`
- ref: yes; className: merged with component classes
- children: `SelectInput.Option`

## `<SelectInput.Option>`

Renders `Radix Select.Item`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `value` * | string |  |  | Option value; must be non-empty. |

\* required

- Passthrough: `Radix Select.Item`
- ref: yes; className: merged with component classes
- children: any

## `<SelectInput.Microcopy>`

Renders `p (DS Microcopy)`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `error` | boolean |  | `false` | Error color. |

\* required

- Passthrough: `ComponentProps<'p'>`
- ref: yes; className: merged with component classes
- children: any

## Constraints

- **composition** (`SelectInput.Option`): Options go inside Content; Trigger and Content inside Root.

## Not supported

- multi-select.
- Option with an empty-string value.
