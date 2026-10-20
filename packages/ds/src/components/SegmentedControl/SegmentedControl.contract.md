<!-- GENERATED from SegmentedControl.contract.json by `pnpm --filter ds contracts:build`. Do not edit. -->

# SegmentedControl contract

Pill-shaped single-select control built on Radix Tabs (manual activation by default).

**Only the props, variants and values listed here exist. Do not invent others.**

Spec: [SegmentedControl.spec.md](./SegmentedControl.spec.md)

Import: `import { SegmentedControl } from 'ds'`

## `<SegmentedControl.Root>`

Renders `div (Radix Tabs.Root)`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `density` | enum | `roomy`, `condensed` |  | Sets data-density on the element; omit to inherit from the nearest ancestor. |
| `activationMode` | enum | `automatic`, `manual` | `"manual"` | Differs from Tabs, which is automatic. |

\* required

- Passthrough: `Radix Tabs.Root`. value, defaultValue, onValueChange, orientation, dir.
- ref: yes; className: merged with component classes
- children: `SegmentedControl.List`, `SegmentedControl.Content`

## `<SegmentedControl.List>`

Renders `Radix Tabs.List`. Hugs its Triggers; for full width pass className="flex w-full" here and "grow basis-0" on each Trigger.

No component-specific props.

- Passthrough: `Radix Tabs.List`
- ref: yes; className: merged with component classes
- children: `SegmentedControl.Trigger`

## `<SegmentedControl.Trigger>`

Renders `Radix Tabs.Trigger`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `icon` | node |  |  | Leading icon. |
| `value` * | string |  |  | Tab value. |

\* required

- Passthrough: `Radix Tabs.Trigger`
- ref: yes; className: merged with component classes
- children: any

## `<SegmentedControl.Content>`

Renders `Radix Tabs.Content`. Unstyled panel.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `value` * | string |  |  | Matches a Trigger value. |

\* required

- Passthrough: `Radix Tabs.Content`
- ref: yes; className: merged with component classes
- children: any

## Constraints

- **composition** (`SegmentedControl.Trigger`): Triggers go inside List; Content is a sibling of List inside Root.

## Not supported

- size / variant props.
