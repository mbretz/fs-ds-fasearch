<!-- GENERATED from Link.contract.json by `pnpm --filter ds contracts:build`. Do not edit. -->

# Link contract

Inline text link (a) with underline control and optional new-window trailing icon.

**Only the props, variants and values listed here exist. Do not invent others.**

Import: `import { Link } from 'ds'`

## `<Link>`

Renders `a`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `newWindow` | boolean |  |  | Shows trailing icon, sets target="_blank" rel="noopener noreferrer", adds sr-only text. |
| `underline` | boolean |  | `true` | Underline decoration. |
| `iconVerticalAlign` | enum | `start`, `center`, `end` | `"end"` | Trailing icon alignment against wrapped text. |
| `asChild` | boolean |  |  | Render the child (e.g. router Link) instead of <a>. The new-window icon is not added in this mode. |

\* required

- Passthrough: `ComponentProps<'a'>`
- ref: yes; className: merged with component classes
- children: any

## Constraints

- **usage**: Use Link for navigation; use Button for actions.

## Not supported

- variant / color props.
- icon props other than newWindow.
