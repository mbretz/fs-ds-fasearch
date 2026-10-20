<!-- GENERATED from Button.contract.json by `pnpm --filter ds contracts:build`. Do not edit. -->

# Button contract

Triggers an action (submit, open/close something). Navigation to another place is a Link, not a Button.

**Only the props, variants and values listed here exist. Do not invent others.**

Spec: [Button.spec.md](./Button.spec.md)

Import: `import { Button, buttonRootVariants } from 'ds'`

## `<Button>`

Renders `button`. Convenience wrapper composing Root + optional Icon(s) + Label. Use this by default.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `children` * | node |  |  | Label content. Stays mounted (as the accessible name) when showLabel is false. |
| `showLabel` | boolean |  | `true` | false = icon-only button; label is visually hidden. |
| `iconStart` | node |  |  | Icon before the label. |
| `iconEnd` | node |  |  | Icon after the label. |
| `variant` | enum | `primary`, `secondary`, `tertiary` | `"primary"` |  |
| `destructive` | boolean |  | `false` | Critical-response styling; combines with every variant. |
| `density` | enum | `roomy`, `condensed` |  | Sets data-density on the element; omit to inherit from the nearest ancestor. |
| `asChild` | boolean |  |  | Render the child element instead of a <button> (Radix Slot). |
| `aria-label` | string |  |  | Overrides the accessible name. |

\* required

- Passthrough: `ComponentProps<'button'>` — omits `aria-label`. All native button attributes and event handlers.
- ref: yes; className: merged with component classes
- children: any

## `<Button.Root>`

Renders `button`. Bare styled button for custom composition. Use only when Button's iconStart/iconEnd/label layout is not enough.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `variant` | enum | `primary`, `secondary`, `tertiary` | `"primary"` |  |
| `destructive` | boolean |  | `false` |  |
| `density` | enum | `roomy`, `condensed` |  |  |
| `asChild` | boolean |  |  |  |
| `iconOnly` | boolean |  | `false` | Square, icon-only sizing. Button sets this from showLabel={false}; set it yourself only on Root. |
| `aria-label` | string |  |  |  |

\* required

- Passthrough: `ComponentProps<'button'>` — omits `aria-label`
- ref: yes; className: merged with component classes
- children: `Button.Icon`, `Button.Label`

## `<Button.Icon>`

Renders `span`.

No component-specific props.

- Passthrough: `ComponentProps<'span'>`
- ref: yes; className: merged with component classes
- children: any — An svg icon.

## `<Button.Label>`

Renders `span`.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `visuallyHidden` | boolean |  |  | Hides the label visually but keeps it as the accessible name. |

\* required

- Passthrough: `ComponentProps<'span'>`
- ref: yes; className: merged with component classes
- children: any

## Constraints

- **a11y** (`Button`): An icon-only button (showLabel={false}) must still have children (its accessible name) or an aria-label.
- **composition** (`Button.Icon`): Button.Icon and Button.Label are only valid inside Button.Root.
- **usage**: If the element navigates (same page anchor or another page), use Link instead of Button.
- **usage**: Use destructive (not a custom color) for delete-like actions; do not use variant='primary' non-destructive for irreversible actions.
- **usage**: At most three buttons per group; order tertiary, secondary, primary left to right.

## Not supported

- size prop (Figma has no Size variant; size comes from density).
- variant values other than primary | secondary | tertiary (no 'reversed', 'ghost', 'link', 'outline', 'danger').
- intent / color / tone props (use destructive).
- loading / isLoading prop.
- href prop (use Link, or asChild with an anchor).
