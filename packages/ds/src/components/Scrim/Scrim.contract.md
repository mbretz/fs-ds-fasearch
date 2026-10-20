<!-- GENERATED from Scrim.contract.json by `pnpm --filter ds contracts:build`. Do not edit. -->

# Scrim contract

Fixed full-viewport backdrop (div). Apply a z-index-* utility yourself.

**Only the props, variants and values listed here exist. Do not invent others.**

Import: `import { Scrim } from 'ds'`

## `<Scrim>`

Renders `div`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `asChild` | boolean |  |  | Render onto a supplied element, e.g. Radix Dialog.Overlay. |

\* required

- Passthrough: `ComponentProps<'div'>`
- ref: yes; className: merged with component classes
- children: none

## Constraints

- **usage**: Scrim has no default z-index; add one of theme.css's z-index-* utilities via className.

## Not supported

- variant / opacity props.
