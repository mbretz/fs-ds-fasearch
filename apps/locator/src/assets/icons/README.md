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

| Icon                   | Component            | Figma node                                                                                                                | Used by                                   | Notes                                                                                                                                        |
| ---------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Briefcase (tenure)     | `IconBriefcase.tsx`  | `303:4188` (a raw vector group inside `.FA-Card-Header-Content`, not a reusable Icons-library component)                  | `entity-card/TenureLine`                  | Source SVG is `icon-briefcase.svg` in this directory.                                                                                        |
| Invitation (accepting) | `IconInvitation.tsx` | `1:458` (the `Badge` component set's "accepting" glyph, `202:3542`)                                                       | `entity-info/statusMeta` (`accepting`)    | Source SVG is `icon-invitation.svg`. Previously wrongly mapped to `packages/icons`' `MessageEnvelope`.                                       |
| Referral               | `IconReferral.tsx`   | `3:3609` (the `Badge` component set's "referral" glyph, `202:3542`) -- a star with a partial orbit/loop, not a share icon | `entity-info/statusMeta` (`referralOnly`) | Source SVG is `icon-referral.svg`. Previously wrongly mapped to `packages/icons`' `Share`.                                                   |
| Waitlist (stopwatch)   | `IconWaitlist.tsx`   | `1:474` (the `Badge` component set's "waitlist" glyph, `202:3542`) -- a stopwatch with a crown/stem and start button      | `entity-info/statusMeta` (`waitlist`)     | Source SVG is `icon-waitlist.svg`. Previously wrongly mapped to `packages/icons`' `DateClock` (a plain round clock face, no stopwatch stem). |

When one of these lands in `packages/icons` for real: delete the local
`.tsx`/`.svg` pair, swap the importing component to `import { X } from
'icons'`, and remove its row above.

## Brand marks

Unlike the contribution-backlog glyphs above, these are third-party
trademarked logos (official LinkedIn/Facebook brand-assets downloads,
2026-09-20) -- they belong here permanently, not as a stand-in for a
future `packages/icons` contribution, since a generic design-system
icon library is the wrong home for another company's trademark. Kept as
plain PNGs (not SVGR'd to a `currentColor` component like the glyphs
above) since a brand mark's colors are fixed by the trademark owner, not
something a consuming component should be able to recolor.

| Mark     | Source (as downloaded)      | Used-from asset              | Used by             | Notes                                                                                                                                                                         |
| -------- | --------------------------- | ---------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| LinkedIn | `linkedin-badge-source.png` | `linkedin-badge-cropped.png` | `cards/AdvisorCard` | Source canvas includes a trailing ® mark outside the badge itself; `-cropped` is a hand pixel-crop to just the square badge (0,0,540,540), see git history for the crop tool. |
| Facebook | `facebook-logo-source.png`  | `facebook-logo-source.png`   | `cards/AdvisorCard` | Source is already a square, transparent-background mark -- no crop needed, imported directly.                                                                                 |

Both are consumed via `vite-imagetools` query-param imports (`?w=…&as=srcset`), same build-time-responsive-image convention as `AdvisorSearchModule/Start.tsx`'s hero image -- see `AdvisorCard.tsx`'s own import comment.
