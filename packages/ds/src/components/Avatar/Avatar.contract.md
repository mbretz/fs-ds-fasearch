<!-- GENERATED from Avatar.contract.json by `pnpm --filter ds contracts:build`. Do not edit. -->

# Avatar contract

Circular (associate) or rounded-square (entity) image with an initials/icon fallback (Radix Avatar).

**Only the props, variants and values listed here exist. Do not invent others.**

Spec: [Avatar.spec.md](./Avatar.spec.md)

Import: `import { Avatar, avatarRootVariants } from 'ds'`

## `<Avatar.Root>`

Renders `span (Radix Avatar.Root)`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `size` | enum | `xs`, `sm`, `md`, `lg`, `xl`, `2xl` | `"md"` |  |
| `variant` | enum | `associate`, `entity` | `"associate"` | associate = person (circle); entity = organization (rounded square). |

\* required

- Passthrough: `Radix Avatar.Root`. Supports asChild.
- ref: yes; className: merged with component classes
- children: `Avatar.Image`, `Avatar.Fallback`

## `<Avatar.Image>`

Renders `img (Radix Avatar.Image)`.

No component-specific props.

- Passthrough: `Radix Avatar.Image`. onLoadingStatusChange available.
- ref: yes; className: merged with component classes
- children: none

## `<Avatar.Fallback>`

Renders `span (Radix Avatar.Fallback)`. Initials text or an icon; shown when the image is missing, errored or loading.

No component-specific props.

- Passthrough: `Radix Avatar.Fallback`. delayMs available.
- ref: yes; className: merged with component classes
- children: any — Initials text or an icon sized via var(--avatar-icon-size).

## Constraints

- **composition**: Avatar.Image and Avatar.Fallback are only valid inside Avatar.Root.
- **a11y** (`Avatar.Image`): Pass alt on Avatar.Image; a decorative Avatar needs alt="".

## Not supported

- sizes other than xs | sm | md | lg | xl | 2xl (no numeric px size).
- variant values other than associate | entity.
- a single-component form (<Avatar src=...>); compose Root + Image + Fallback.
