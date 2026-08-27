---
title: 'Grids'
---

# Grids

Grids guide designers in organizing an interface across varying screens.

> An update to Grid Foundations is coming Fall 2025.

## Grid Anatomy

There are three aspects to a grid.

### Columns

Columns constrain elements horizontally, ensuring content aligns throughout the experience.

### Gutters

Gutters are intentional space between columns, ensuring consistent breathing room between content areas.

### Margins

Margins create intentional space around the entire body of content.

## Design For Standard Screen Sizes

Designs should be responsive and able to adapt from larger desktop screens to smaller tablet and phone screens. Grids facilitate this by establishing breakpoints, handling orientation, and maintaining consistency.

The standard resolution for office computers is `1920x1080`, and the minimum supported screen size is `320x568`. Learn more in Mobile Standards.

## Standard Screen Sizes

| Name    | Columns | Gutter Width | Viewport                  | Common Width |
| ------- | ------: | -----------: | ------------------------- | -----------: |
| Small   |       4 |         16px | Min: 320px / Max: 719px   |        390px |
| Medium  |       8 |         16px | Min: 720px / Max: 1039px  |       1024px |
| Large   |      12 |         24px | Min: 1040px / Max: 1319px |       1280px |
| X-Large |      12 |         24px | Min: 1320px / Max: 1920px |       1920px |

## CSS Grid

Columns automatically expand to fill the available grid space, but developers can control their width using simple size classes:

- Small screens, phone and up: `.col__sm$`
- Medium screens, tablet and up: `.col__md$`
- Large screens, desktop and up: `.col__lg$`

Where `$` is the number of grid units the column should take up.

**Best practice:** Use all three size classes together (`sm`, `md`, and `lg`) to ensure a predictable, responsive layout.

## Breakpoint Tokens

Developers can use these breakpoint values to provide responsive designs based on the user's device.

| Token                   |  Value |
| ----------------------- | -----: |
| `ref.breakpoint.small`  |  320px |
| `ref.breakpoint.medium` |  720px |
| `ref.breakpoint.large`  | 1040px |
| `ref.breakpoint.xlarge` | 1320px |
