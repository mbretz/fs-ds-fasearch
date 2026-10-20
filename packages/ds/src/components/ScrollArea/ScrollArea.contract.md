<!-- GENERATED from ScrollArea.contract.json by `pnpm --filter ds contracts:build`. Do not edit. -->

# ScrollArea contract

Custom-scrollbar container (Radix ScrollArea). Use the flat ScrollArea for the common single-viewport case.

**Only the props, variants and values listed here exist. Do not invent others.**

Import: `import { ScrollArea, scrollAreaScrollbarVariants } from 'ds'`

## `<ScrollArea>`

Renders `Radix ScrollArea (Root > Viewport + Scrollbar + Thumb + Corner)`. Flat convenience wrapper.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `children` | node |  |  |  |
| `horizontal` | boolean |  |  | Adds a horizontal scrollbar to the default vertical one. |
| `viewportClassName` | string |  |  | Merged onto the viewport. |
| `density` | enum | `roomy`, `condensed` |  | Sets data-density on the element; omit to inherit from the nearest ancestor. |

\* required

- Passthrough: `Radix ScrollArea.Root` — omits `children`. type, scrollHideDelay, dir.
- ref: yes; className: merged with component classes
- children: any

## `<ScrollArea.Root>`

Renders `Radix ScrollArea.Root`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `density` | enum | `roomy`, `condensed` |  | Sets data-density on the element; omit to inherit from the nearest ancestor. |

\* required

- Passthrough: `Radix ScrollArea.Root`
- ref: yes; className: merged with component classes
- children: `ScrollArea.Viewport`, `ScrollArea.Scrollbar`, `ScrollArea.Corner`

## `<ScrollArea.Viewport>`

Renders `Radix ScrollArea.Viewport`.

No component-specific props.

- Passthrough: `Radix ScrollArea.Viewport`
- ref: yes; className: merged with component classes
- children: any

## `<ScrollArea.Scrollbar>`

Renders `Radix ScrollArea.Scrollbar`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `orientation` | enum | `vertical`, `horizontal` | `"vertical"` |  |

\* required

- Passthrough: `Radix ScrollArea.Scrollbar`
- ref: yes; className: merged with component classes
- children: `ScrollArea.Thumb`

## `<ScrollArea.Thumb>`

Renders `Radix ScrollArea.Thumb`.

No component-specific props.

- Passthrough: `Radix ScrollArea.Thumb`
- ref: yes; className: merged with component classes
- children: none

## `<ScrollArea.Corner>`

Renders `Radix ScrollArea.Corner`.

No component-specific props.

- Passthrough: `Radix ScrollArea.Corner`
- ref: yes; className: merged with component classes
- children: none

## Constraints

- **composition** (`ScrollArea.Thumb`): Viewport, Scrollbar and Corner go inside Root; Thumb inside Scrollbar.

## Not supported

- a bespoke imperative scroll API (use Element.scrollIntoView on children).
