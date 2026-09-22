# Locator-local profile icons

Same rationale as `../icons/README.md`: these are stand-ins for glyphs
`packages/icons` doesn't have yet, kept local to `apps/locator` per the
user's 2026-09-18 direction rather than hand-added to the shared library.
Split into their own directory (not merged into `../icons`) since they're
all one component set with a distinct purpose -- the profile-body icon
row (bio meta: experience, education, focus areas, personal interests) --
rather than one-off glyphs used individually across different components.

Each entry is a real Figma vector, downloaded and hand-converted to a
small `forwardRef` component matching `packages/icons`' own generated
shape -- `currentColor` swapped in for the source SVG's literal stroke,
same convention `packages/icons`' SVGR pipeline applies automatically.
The downloaded `.svg` is kept alongside each component as the literal
source asset for whoever eventually does that contribution. The circle
background each variant has in Figma is intentionally **not** part of
these exports -- only the inner icon group was downloaded -- since the
profile-body layout these are destined for hasn't been built yet and
may not want a circle chip treatment; revisit if it turns out to.

## Contribution backlog

| Icon               | Component                   | Figma node (icon group, circle bg excluded)                            | Notes                                   |
| ------------------ | --------------------------- | ---------------------------------------------------------------------- | --------------------------------------- |
| Experience         | `IconExperience.tsx`        | `1:744` (component set `1:741`, "Profile Icon", Property 1=Experience) | Source SVG is `experience.svg`.         |
| Education          | `IconEducation.tsx`         | `1:750` (component set `1:741`, Property 1=Education)                  | Source SVG is `education.svg`.          |
| Focus Areas        | `IconFocusAreas.tsx`        | `1:758` (component set `1:741`, Property 1=Focus Areas)                | Source SVG is `focus-areas.svg`.        |
| Personal Interests | `IconPersonalInterests.tsx` | `1:766` (component set `1:741`, Property 1=Personal Interests)         | Source SVG is `personal-interests.svg`. |

When one of these lands in `packages/icons` for real: delete the local
`.tsx`/`.svg` pair, swap the importing component to `import { X } from
'icons'`, and remove its row above.
