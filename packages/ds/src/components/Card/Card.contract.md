<!-- GENERATED from Card.contract.json by `pnpm --filter ds contracts:build`. Do not edit. -->

# Card contract

Bordered surface with optional collapsible header (Radix Collapsible); compose Root + Header + Body + Footer.

**Only the props, variants and values listed here exist. Do not invent others.**

Spec: [Card.spec.md](./Card.spec.md)

Import: `import { Card } from 'ds'`

## `<Card.Root>`

Renders `div (Radix Collapsible.Root)`. defaultOpen is true. open/defaultOpen/onOpenChange/disabled only matter when Header is expandable.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `density` | enum | `roomy`, `condensed` |  | Sets data-density on the element; omit to inherit from the nearest ancestor. |
| `asChild` | boolean |  |  | Render the child element (e.g. <section>) instead of a <div>. |

\* required

- Passthrough: `ComponentProps<'div'> + Radix Collapsible.Root (open, defaultOpen, onOpenChange, disabled)` — omits `onOpenChange (div)`
- ref: yes; className: merged with component classes
- children: `Card.Header`, `Card.Body`, `Card.Footer`

## `<Card.Header>`

Renders `div, or button when expandable`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `expandable` | boolean |  |  | Header becomes the Collapsible trigger and renders as a <button>. |
| `showBorder` | boolean |  | `true` | Bottom border; on an expandable header it only shows while open. |
| `ref` | other |  |  | Ref<HTMLElement> (the element is a div or a button). |

\* required

- Passthrough: `ComponentProps<'div'>`
- ref: yes; className: merged with component classes
- children: `Card.HeaderTitle`, `Card.HeaderDescription` — When expandable, children render inside a native <button>: no nested links, buttons or form controls.

## `<Card.HeaderTitle>`

Renders `div`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `icon` | node |  |  | Leading icon. |

\* required

- Passthrough: `ComponentProps<'div'>`
- ref: yes; className: merged with component classes
- children: any

## `<Card.HeaderDescription>`

Renders `div`.

No component-specific props.

- Passthrough: `ComponentProps<'div'>`
- ref: yes; className: merged with component classes
- children: any

## `<Card.Body>`

Renders `div (inside Collapsible.Content)`. Collapses with an expandable Header.

No component-specific props.

- Passthrough: `ComponentProps<'div'>`
- ref: yes; className: merged with component classes
- children: any

## `<Card.Footer>`

Renders `div (inside Collapsible.Content)`. Column layout; collapses with an expandable Header.

No component-specific props.

- Passthrough: `ComponentProps<'div'>`
- ref: yes; className: merged with component classes
- children: any

## Constraints

- **composition**: Card.* parts are only valid inside Card.Root.
- **conflicts** (`Card.Header`): Do not nest interactive elements inside an expandable Card.Header.
- **usage** (`Card.Footer`): Card.Footer is a column; for a row of buttons use Dialog.Footer-style layout yourself.

## Not supported

- variant / elevation / color props.
- a Card.Title (use Card.HeaderTitle).
- controlled collapse without Card.Header expandable (open only has an effect on collapsible content).
