---
title: 'Specs'
---

# Specs

Cross-cutting UX, accessibility, and content guidance for this design system — not tied to any single component. Per-component acceptance criteria and accessibility contracts live colocated with that component instead (e.g. `src/components/Dialog/Dialog.spec.md`), not here.

## Structure

```
standards/           Org-wide standards a component or consumer should comply with
  accessibility-standards.md   WCAG 2.1 approach, disability categories, ARIA usage
  formatting-and-style.md      Writing conventions (numbers, dates, email formatting, etc.)
  mobile-standards.md          Mobile-specific considerations
style-foundations/   Design-foundation rationale behind the token system
  animations.md                 Motion principles
  colors.md                     Semantic color token groups and usage rules
  elevation.md                  Shadow/stacking rationale (see also each component's own spec
                                 for how it maps to this design system's actual z-index scale)
  grids-and-layout.md           Grid anatomy and standard screen sizes
  sizing.md                     Sizing token scale
  spacing.md                    Spacing token scale and 8px grid
  surfaces.md                   Surface/module hierarchy
  typography.md                 Type scale and semantic type styles
```

Coverage is scoped to what's immediately relevant to components already built here; more standards/foundations topics will be added as the system grows.
