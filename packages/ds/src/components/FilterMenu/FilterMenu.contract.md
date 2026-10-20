<!-- GENERATED from FilterMenu.contract.json by `pnpm --filter ds contracts:build`. Do not edit. -->

# FilterMenu contract

Popover filter panel: Header (anchor) with a Trigger and ClearButton, and a Content drawer (Radix Popover).

**Only the props, variants and values listed here exist. Do not invent others.**

Spec: [FilterMenu.spec.md](./FilterMenu.spec.md)

Import: `import { FilterMenu } from 'ds'`

## `<FilterMenu.Root>`

Renders `div wrapper > Radix Popover.Root`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `className` | string |  |  |  |
| `density` | enum | `roomy`, `condensed` |  | Sets data-density on the element; omit to inherit from the nearest ancestor. |

\* required

- Passthrough: `Radix Popover.Root`. open, defaultOpen, onOpenChange, modal.
- ref: yes; className: merged with component classes
- children: `FilterMenu.Header`, `FilterMenu.Content`

## `<FilterMenu.Header>`

Renders `div (Popover.Anchor)`. Content aligns to this whole row.

No component-specific props.

- Passthrough: `ComponentProps<'div'>`
- ref: yes; className: merged with component classes
- children: `FilterMenu.Trigger`, `FilterMenu.ClearButton`

## `<FilterMenu.Trigger>`

Renders `button (Button, tertiary, filter icon, Popover.Trigger)`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `children` | node |  |  | Static label. Mutually exclusive with collapsedLabel/expandedLabel. |
| `collapsedLabel` | node |  |  | Label while closed; requires expandedLabel. |
| `expandedLabel` | node |  |  | Label while open; requires collapsedLabel. |
| `showLabel` | boolean |  | `true` |  |
| `iconEnd` | other |  |  | Trailing icon node. |
| `destructive` | boolean |  | `false` |  |
| `density` | enum | `roomy`, `condensed` |  | Sets data-density on the element; omit to inherit from the nearest ancestor. |
| `asChild` | boolean |  |  | Render the child element instead of the default element (Radix Slot). |
| `aria-label` | string |  |  |  |

\* required

- Passthrough: `ComponentProps<'button'> via Button (variant, iconStart, children omitted)`
- ref: yes; className: merged with component classes
- children: any — Either children, or collapsedLabel + expandedLabel together (compile error otherwise).

## `<FilterMenu.ClearButton>`

Renders `button (Button, tertiary)`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `children` * | node |  |  | Label. |
| `count` | number |  |  | Renders a Tag count badge when provided. |
| `showLabel` | boolean |  | `true` |  |
| `iconStart` | node |  |  | Leading icon. |
| `destructive` | boolean |  | `false` |  |
| `density` | enum | `roomy`, `condensed` |  | Sets data-density on the element; omit to inherit from the nearest ancestor. |
| `asChild` | boolean |  |  | Render the child element instead of the default element (Radix Slot). |
| `aria-label` | string |  |  |  |

\* required

- Passthrough: `ComponentProps<'button'> via Button (variant, iconEnd omitted)`
- ref: yes; className: merged with component classes
- children: any

## `<FilterMenu.Content>`

Renders `Radix Popover.Content (no Portal)`. Not portaled; inherits ambient data-density.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `density` | enum | `roomy`, `condensed` |  | Sets data-density on the element; omit to inherit from the nearest ancestor. |

\* required

- Passthrough: `Radix Popover.Content`. Defaults side="bottom", align="start", avoidCollisions=false; overridable.
- ref: yes; className: merged with component classes
- children: `FilterMenu.Drawer`, `FilterMenu.Footer`

## `<FilterMenu.Drawer>`

Renders `div`. Scrolls (overflow-y); Footer stays outside the scroll region.

No component-specific props.

- Passthrough: `ComponentProps<'div'>`
- ref: yes; className: merged with component classes
- children: any

## `<FilterMenu.Footer>`

Renders `div`.

No component-specific props.

- Passthrough: `ComponentProps<'div'>`
- ref: yes; className: merged with component classes
- children: any

## Constraints

- **composition** (`FilterMenu.Trigger`): Trigger must be inside Header inside Root; Content inside Root.
- **conflicts** (`FilterMenu.Trigger`): Do not pass children together with collapsedLabel/expandedLabel.
- **usage**: Do not pass variant or iconStart to Trigger, or variant/iconEnd to ClearButton; they are fixed.

## Not supported

- variant on Trigger / ClearButton.
- a Portal (Content renders in flow).
