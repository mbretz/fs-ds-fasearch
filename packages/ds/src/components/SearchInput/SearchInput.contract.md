<!-- GENERATED from SearchInput.contract.json by `pnpm --filter ds contracts:build`. Do not edit. -->

# SearchInput contract

Search field with optional suggestions popover and submit button (Radix Popover).

**Only the props, variants and values listed here exist. Do not invent others.**

Spec: [SearchInput.spec.md](./SearchInput.spec.md)

Import: `import { SearchInput, searchInputFieldVariants } from 'ds'`

## `<SearchInput.Root>`

Renders `div wrapper > Radix Popover.Root`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `className` | string |  |  |  |
| `density` | enum | `roomy`, `condensed` |  | Sets data-density on the element; omit to inherit from the nearest ancestor. |

\* required

- Passthrough: `Radix Popover.Root`. open, defaultOpen, onOpenChange, modal.
- ref: yes; className: merged with component classes
- children: `SearchInput.Label`, `SearchInput.InputGroup`, `SearchInput.Microcopy`, `SearchInput.Suggestions`

## `<SearchInput.Label>`

Renders `label (DS Label, inset)`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `requirement` | enum | `required`, `optional` |  |  |
| `error` | boolean |  | `false` |  |

\* required

- Passthrough: `Radix Label.Root`
- ref: yes; className: merged with component classes
- children: any

## `<SearchInput.InputGroup>`

Renders `div`.

No component-specific props.

- Passthrough: `ComponentProps<'div'>`
- ref: yes; className: merged with component classes
- children: `SearchInput.Field`, `SearchInput.Button`

## `<SearchInput.Field>`

Renders `input`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `density` | enum | `roomy`, `condensed` |  | Sets data-density on the element; omit to inherit from the nearest ancestor. |
| `iconEnd` | node |  |  | Trailing slot; defaults to SearchInput.ClearButton. Pass null or a node to override. |

\* required

- Passthrough: `ComponentProps<'input'>` — omits `size`, `type`, `role`
- ref: yes; className: merged with component classes
- children: any

## `<SearchInput.ClearButton>`

Renders `button`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `aria-label` | string |  |  | Overrides the default "Clear search" name. |

\* required

- Passthrough: `ComponentProps<'button'>` — omits `type`
- ref: yes; className: merged with component classes
- children: none

## `<SearchInput.Button>`

Renders `button (Button, primary)`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `children` * | node |  |  | Label content. |
| `showLabel` | boolean |  | `true` |  |
| `iconStart` | node |  |  |  |
| `iconEnd` | node |  |  |  |
| `destructive` | boolean |  | `false` |  |
| `density` | enum | `roomy`, `condensed` |  | Sets data-density on the element; omit to inherit from the nearest ancestor. |
| `asChild` | boolean |  |  | Render the child element instead of the default element (Radix Slot). |
| `aria-label` | string |  |  |  |

\* required

- Passthrough: `ComponentProps<'button'> via Button (variant omitted)`
- ref: yes; className: merged with component classes
- children: any

## `<SearchInput.Microcopy>`

Renders `p (DS Microcopy)`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `error` | boolean |  | `false` | Error color. |

\* required

- Passthrough: `ComponentProps<'p'>`
- ref: yes; className: merged with component classes
- children: any

## `<SearchInput.Suggestions>`

Renders `Radix Popover.Content in a Portal`. Portal-rendered; density defaults to roomy.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `density` | enum | `roomy`, `condensed` |  | Sets data-density on the element; omit to inherit from the nearest ancestor. |

\* required

- Passthrough: `Radix Popover.Content`
- ref: yes; className: merged with component classes
- children: `SearchInput.Option`

## `<SearchInput.Option>`

Renders `button`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `onSelect` | function |  |  | Fires on click, Enter or Space; the drawer closes and focus returns to the field. |

\* required

- Passthrough: `ComponentProps<'button'>` — omits `type`, `role`
- ref: yes; className: merged with component classes
- children: any

## Constraints

- **composition**: Every SearchInput.* part must be inside SearchInput.Root (throws otherwise).

## Not supported

- type / size / role props on Field.
- variant on Button (fixed primary).
