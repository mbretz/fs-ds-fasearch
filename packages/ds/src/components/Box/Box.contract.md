<!-- GENERATED from Box.contract.json by `pnpm --filter ds contracts:build`. Do not edit. -->

# Box contract

Padding-only layout primitive (div) with token-backed padding steps.

**Only the props, variants and values listed here exist. Do not invent others.**

Import: `import { Box, boxVariants } from 'ds'`

## `<Box>`

Renders `div`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `padding` | enum | `none`, `xx-small`, `x-small`, `small`, `med`, `large`, `x-large`, `xx-large` | `"none"` | Density-reactive spacing step. |
| `asChild` | boolean |  |  | Render the child element instead of the default element (Radix Slot). |

\* required

- Passthrough: `ComponentProps<'div'>`
- ref: yes; className: merged with component classes
- children: any

## Constraints

- **usage**: Padding is the named steps only; no numbers or px strings.

## Not supported

- numeric / px padding values.
- margin, paddingX/paddingY props.
- responsive (breakpoint) prop values.
