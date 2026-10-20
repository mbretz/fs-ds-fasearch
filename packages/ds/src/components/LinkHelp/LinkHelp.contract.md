<!-- GENERATED from LinkHelp.contract.json by `pnpm --filter ds contracts:build`. Do not edit. -->

# LinkHelp contract

Help-style link (a) with a built-in leading help icon.

**Only the props, variants and values listed here exist. Do not invent others.**

Spec: [LinkHelp.spec.md](./LinkHelp.spec.md)

Import: `import { LinkHelp } from 'ds'`

## `<LinkHelp>`

Renders `a`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `asChild` | boolean |  |  | Render the child element instead of the default element (Radix Slot). |

\* required

- Passthrough: `ComponentProps<'a'>`
- ref: yes; className: merged with component classes
- children: any

## Not supported

- icon override.
- underline / newWindow props (use Link for those).
