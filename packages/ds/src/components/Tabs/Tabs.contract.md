<!-- GENERATED from Tabs.contract.json by `pnpm --filter ds contracts:build`. Do not edit. -->

# Tabs contract

Tabs (Radix Tabs) with automatic activation.

**Only the props, variants and values listed here exist. Do not invent others.**

Import: `import { Tabs, tabsTriggerVariants } from 'ds'`

## `<Tabs.Root>`

Renders `div (Radix Tabs.Root)`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `density` | enum | `roomy`, `condensed` |  | Sets data-density on the element; omit to inherit from the nearest ancestor. |

\* required

- Passthrough: `Radix Tabs.Root`. value, defaultValue, onValueChange, orientation, activationMode, dir.
- ref: yes; className: merged with component classes
- children: `Tabs.List`, `Tabs.Content`

## `<Tabs.List>`

Renders `Radix Tabs.List`.

No component-specific props.

- Passthrough: `Radix Tabs.List`
- ref: yes; className: merged with component classes
- children: `Tabs.Trigger`

## `<Tabs.Trigger>`

Renders `Radix Tabs.Trigger`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `value` * | string |  |  | Tab value. |

\* required

- Passthrough: `Radix Tabs.Trigger`
- ref: yes; className: merged with component classes
- children: any

## `<Tabs.Content>`

Renders `Radix Tabs.Content`. Unstyled panel.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `value` * | string |  |  | Matches a Trigger value. |

\* required

- Passthrough: `Radix Tabs.Content`
- ref: yes; className: merged with component classes
- children: any

## Constraints

- **composition** (`Tabs.Trigger`): Triggers go inside List; Content is a sibling of List inside Root.

## Not supported

- variant / size props.
