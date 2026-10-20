<!-- GENERATED from CloseButton.contract.json by `pnpm --filter ds contracts:build`. Do not edit. -->

# CloseButton contract

Fixed tertiary icon-only close button (a configured Button).

**Only the props, variants and values listed here exist. Do not invent others.**

Import: `import { CloseButton } from 'ds'`

## `<CloseButton>`

Renders `button (Button)`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `density` | enum | `roomy`, `condensed` |  | Forwarded to Button. |
| `aria-label` | string |  |  | Overrides the default "Close" accessible name. |

\* required

- Passthrough: `Pick<ComponentProps<'button'>>` — only `onClick`, `disabled`, `className`, `id`, `ref`
- ref: yes; className: merged with component classes
- children: none

## Constraints

- **usage**: Do not pass variant, children, icon or showLabel; the configuration is fixed.

## Not supported

- variant, children, icon, showLabel, type, form, name props (explicit allow-list).
