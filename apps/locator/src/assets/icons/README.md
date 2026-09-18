# Locator-local icons

Icons staged here are stand-ins for glyphs `packages/icons` doesn't have
yet. Kept local to `apps/locator` deliberately, per the user
(2026-09-18): in a real-world team setup, needing a new icon while
building a product surface is a contribution request against the shared
icon library, not something a product team hand-adds to it directly.
Expect more of these as profile pages and other locator surfaces get
built out.

Each entry below is a real Figma vector, downloaded and hand-converted to
a small `forwardRef` component matching `packages/icons`' own generated
shape (see e.g. `packages/icons/src/generated/MessageEnvelope.tsx`) --
`currentColor` swapped in for the source SVG's literal stroke/fill, same
convention `packages/icons`' SVGR pipeline applies automatically. The
downloaded `.svg` is kept alongside each component as the literal source
asset for whoever eventually does that contribution.

## Contribution backlog

| Icon               | Component           | Figma node                                                                                               | Used by                  | Notes                                                 |
| ------------------ | ------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------ | ----------------------------------------------------- |
| Briefcase (tenure) | `IconBriefcase.tsx` | `303:4188` (a raw vector group inside `.FA-Card-Header-Content`, not a reusable Icons-library component) | `entity-card/TenureLine` | Source SVG is `icon-briefcase.svg` in this directory. |

When one of these lands in `packages/icons` for real: delete the local
`.tsx`/`.svg` pair, swap the importing component to `import { X } from
'icons'`, and remove its row above.
