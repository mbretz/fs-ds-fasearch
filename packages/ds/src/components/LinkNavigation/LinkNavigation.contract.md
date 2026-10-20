<!-- GENERATED from LinkNavigation.contract.json by `pnpm --filter ds contracts:build`. Do not edit. -->

# LinkNavigation contract

Previous/next navigation link (a) with a chevron.

**Only the props, variants and values listed here exist. Do not invent others.**

Import: `import { LinkNavigation } from 'ds'`

## `<LinkNavigation>`

Renders `a`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `direction` * | enum | `previous`, `next` |  |  |
| `iconAlign` | enum | `start`, `center`, `end` | `"center"` | Chevron alignment against the text. |
| `asChild` | boolean |  |  | Render the child element instead of the default element (Radix Slot). |

\* required

- Passthrough: `ComponentProps<'a'>`
- ref: yes; className: merged with component classes
- children: any

## Constraints

- **requires-prop** (`LinkNavigation`): direction is required.

## Not supported

- custom icon.
