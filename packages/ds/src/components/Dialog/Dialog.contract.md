<!-- GENERATED from Dialog.contract.json by `pnpm --filter ds contracts:build`. Do not edit. -->

# Dialog contract

Modal dialog (Radix Dialog) with built-in scrim, close button, title and optional description.

**Only the props, variants and values listed here exist. Do not invent others.**

Spec: [Dialog.spec.md](./Dialog.spec.md)

Import: `import { Dialog } from 'ds'`

## `<Dialog.Root>`

Renders `Radix Dialog.Root (no DOM)`.

No component-specific props.

- Passthrough: `Radix Dialog.Root` — only `open`, `defaultOpen`, `onOpenChange`, `modal`, `children`
- ref: no; className: not accepted
- children: `Dialog.Trigger`, `Dialog.Content`

## `<Dialog.Trigger>`

Renders `button`.

No component-specific props.

- Passthrough: `Radix Dialog.Trigger`. Supports asChild.
- ref: yes; className: merged with component classes
- children: any

## `<Dialog.Content>`

Renders `Radix Dialog.Content in a Portal, plus Scrim and CloseButton`. Portal-rendered; sets data-density itself because portals escape the ancestor cascade.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `title` * | node |  |  | Always rendered; the dialog's accessible name. |
| `description` | node |  |  | Optional; omit and Radix warns about a missing description. |
| `density` | enum | `roomy`, `condensed` | `"roomy"` |  |
| `closeButtonAriaLabel` | string |  | `"Close"` |  |
| `closeButtonClassName` | string |  |  | Merged onto the built-in close button. |
| `visuallyHideTitle` | boolean |  | `false` | Keeps the title for a11y but hides it visually. |
| `showScrim` | boolean |  | `true` |  |
| `scrimClassName` | string |  |  | Merged onto the backdrop Scrim. |

\* required

- Passthrough: `Radix Dialog.Content` — omits `title`. Includes onOpenAutoFocus (default focuses the close button), onEscapeKeyDown, onPointerDownOutside, onInteractOutside, forceMount, asChild.
- ref: yes; className: merged with component classes
- children: `Dialog.Header`, `Dialog.Body`, `Dialog.Footer` — Rendered below the built-in title/description.

## `<Dialog.Header>`

Renders `div`.

No component-specific props.

- Passthrough: `ComponentProps<'div'>`
- ref: yes; className: merged with component classes
- children: any

## `<Dialog.Body>`

Renders `div`.

No component-specific props.

- Passthrough: `ComponentProps<'div'>`
- ref: yes; className: merged with component classes
- children: any

## `<Dialog.Footer>`

Renders `Separator + div (row)`. Row layout for action buttons; renders its own Separator above itself.

No component-specific props.

- Passthrough: `ComponentProps<'div'>`
- ref: yes; className: merged with component classes
- children: `Button`

## `<Dialog.Close>`

Renders `button`.

No component-specific props.

- Passthrough: `Radix Dialog.Close`. Supports asChild; use it to wrap Cancel-style buttons.
- ref: yes; className: merged with component classes
- children: any

## Constraints

- **requires-prop** (`Dialog.Content`): Content always needs a title; use visuallyHideTitle to hide it visually rather than omitting it.
- **composition** (`Dialog.Content`): Content and Trigger must be inside Dialog.Root.
- **composition** (`Dialog.Footer`): Do not add a Separator above Footer; it renders its own.
- **usage** (`Dialog.Content`): Do not wrap Content in a scroll container; it is its own scroll container (wrapping breaks Radix scroll-lock).
- **usage** (`Dialog.Content`): Do not add your own close button; Content has one built in.

## Not supported

- size / width props (max width comes from the component token).
- placement / position props (always top-anchored, horizontally centered).
- non-modal custom overlay; use showScrim={false} only to hide the backdrop.
- title as a Dialog.Title child (title is a Content prop).
