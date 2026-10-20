<!-- GENERATED from Checkbox.contract.json by `pnpm --filter ds contracts:build`. Do not edit. -->

# Checkbox contract

Labelled checkbox row (Radix Checkbox). The whole row is a native <label>.

**Only the props, variants and values listed here exist. Do not invent others.**

Spec: [Checkbox.spec.md](./Checkbox.spec.md)

Import: `import { Checkbox, checkboxInputVariants, checkboxLabelVariants } from 'ds'`

## `<Checkbox>`

Renders `label > Radix Checkbox.Root`. className applies to the outer label row.

| Prop | Type | Values | Default | Notes |
| --- | --- | --- | --- | --- |
| `children` | node |  |  | Row label text. |
| `error` | boolean |  | `false` | Recolors the label text only (not the box). |

\* required

- Passthrough: `Radix Checkbox.Root` — omits `children`. checked accepts boolean | "indeterminate"; also defaultChecked, onCheckedChange, required, disabled, name, value.
- ref: yes; className: merged with component classes
- children: any — Label content.

## Constraints

- **usage** (`Checkbox`): Indeterminate state is checked="indeterminate"; there is no separate prop.
- **usage** (`Checkbox`): Do not wrap in your own <label> or add htmlFor; the row is already a label.

## Not supported

- selection / indeterminate prop (use checked="indeterminate").
- size / density props.
- separate Label component pairing.
