<!-- GENERATED from Tag.contract.json by `pnpm --filter ds contracts:build`. Do not edit. -->

# Tag contract

Small static label badge. Flat Tag, or composed Tag.Root + Tag.Label for extra content.

**Only the props, variants and values listed here exist. Do not invent others.**

Spec: [Tag.spec.md](./Tag.spec.md)

Import: `import { Tag, tagRootVariants } from 'ds'`

## `<Tag>`

Renders `span`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `children` * | node |  |  | Label. |
| `size` | enum | `sm`, `lg` | `"lg"` |  |
| `variant` | enum | `generic`, `teal`, `red`, `gold` | `"generic"` |  |
| `borderWidth` | enum | `default`, `heavy` | `"default"` |  |
| `asChild` | boolean |  |  | Render the child element instead of the default element (Radix Slot). |

\* required

- Passthrough: `ComponentProps<'span'>`
- ref: yes; className: merged with component classes
- children: any

## `<Tag.Root>`

Renders `span`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `size` | enum | `sm`, `lg` | `"lg"` |  |
| `variant` | enum | `generic`, `teal`, `red`, `gold` | `"generic"` |  |
| `borderWidth` | enum | `default`, `heavy` | `"default"` |  |
| `asChild` | boolean |  |  | Render the child element instead of the default element (Radix Slot). |

\* required

- Passthrough: `ComponentProps<'span'>`
- ref: yes; className: merged with component classes
- children: `Tag.Label`

## `<Tag.Label>`

Renders `span`.

No component-specific props.

- Passthrough: `ComponentProps<'span'>`
- ref: yes; className: merged with component classes
- children: any

## Not supported

- density prop.
- variant values other than generic | teal | red | gold.
- a dismiss control (use Chip).
