<!-- GENERATED from Grid.contract.json by `pnpm --filter ds contracts:build`. Do not edit. -->

# Grid contract

CSS grid layout primitive with token-backed gaps. Extends Box.

**Only the props, variants and values listed here exist. Do not invent others.**

Import: `import { Grid, gridVariants } from 'ds'`

## `<Grid>`

Renders `div`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `columns` | number |  |  | Equal-width column count via inline style; omit to lay columns out via className/style. |
| `gap` | enum | `none`, `xx-small`, `x-small`, `small`, `med`, `large`, `x-large`, `xx-large` | `"none"` |  |
| `columnGap` | enum | `none`, `xx-small`, `x-small`, `small`, `med`, `large`, `x-large`, `xx-large` |  |  |
| `rowGap` | enum | `none`, `xx-small`, `x-small`, `small`, `med`, `large`, `x-large`, `xx-large` |  |  |
| `align` | enum | `start`, `center`, `end`, `stretch` |  |  |
| `justify` | enum | `start`, `center`, `end`, `stretch` |  |  |
| `padding` | enum | `none`, `xx-small`, `x-small`, `small`, `med`, `large`, `x-large`, `xx-large` |  | Inherited from Box. |
| `asChild` | boolean |  |  | Inherited from Box. |

\* required

- Passthrough: `ComponentProps<'div'>`
- ref: yes; className: merged with component classes
- children: any

## Constraints

- **usage**: gap/columnGap/rowGap/padding are the named steps only.

## Not supported

- rows prop.
- gap as numbers or px strings.
- responsive prop values.
