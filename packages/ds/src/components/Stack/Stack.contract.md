<!-- GENERATED from Stack.contract.json by `pnpm --filter ds contracts:build`. Do not edit. -->

# Stack contract

Flex layout primitive with token-backed gap and padding. Extends Box.

**Only the props, variants and values listed here exist. Do not invent others.**

Import: `import { Stack, stackVariants } from 'ds'`

## `<Stack>`

Renders `div`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `direction` | enum | `row`, `column` | `"column"` |  |
| `gap` | enum | `none`, `xx-small`, `x-small`, `small`, `med`, `large`, `x-large`, `xx-large` | `"none"` | Density-reactive spacing step. |
| `align` | enum | `start`, `center`, `end`, `stretch`, `baseline` |  |  |
| `justify` | enum | `start`, `center`, `end`, `between`, `around`, `evenly` |  |  |
| `wrap` | boolean |  |  |  |
| `padding` | enum | `none`, `xx-small`, `x-small`, `small`, `med`, `large`, `x-large`, `xx-large` |  | Inherited from Box. |
| `asChild` | boolean |  |  | Inherited from Box. Render the child element instead of a <div>. |

\* required

- Passthrough: `ComponentProps<'div'>`
- ref: yes; className: merged with component classes
- children: any

## Constraints

- **usage**: Spacing values are the named steps only; no pixel numbers or arbitrary strings.

## Not supported

- gap/padding as numbers or px strings.
- responsive (breakpoint) prop values.
- separate paddingX/paddingY or margin props (use Box/className for those).
