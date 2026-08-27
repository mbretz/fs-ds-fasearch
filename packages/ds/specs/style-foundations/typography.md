---
title: 'Type'
---

# Type

Learn about the type model: scale, semantic styles, variable-font considerations, and accessibility requirements.

## About The Brand Typeface

`DS Sans Text Var` is a stand-in for a proprietary corporate variable typeface used in the original type styles this system was modeled on. That original font is licensed for a specific company's own properties and can't be redistributed here, so it's substituted with [Inter](https://rsms.me/inter/) (SIL Open Font License), a genuine variable font shipped under the same family name so every existing token, type style, and weight (including the in-between values like `450`/`525`/`575` below) keeps working unchanged.

Inter was chosen deliberately, not by default: the original type specimens (single-story `g` with an open hook tail, wide circular `o`, large x-height, short unserifed arm on the `r`) matched Inter's letterforms closely enough to stand in as a faithful visual substitute, and it covers the full `100`–`900` weight axis the original styles actually use. The `@font-face` declaration and font file live in `packages/ds/src/theme.css` and `packages/ds/src/assets/fonts/`.

## About Variable Fonts

This type system uses a variable font. Variable fonts remove the explicit distinctions between weights such as Light, Regular, Bold, and Black, which have existed since the early days of typesetting. Although designers can still reach for those common weights, variable fonts make the exact weight more nuanced depending on the needs of the design. Variable fonts have gained popularity in recent years and have extensive browser support.

## Scale

Scale refers to the system of font sizes from smallest to largest. The type scale defines available sizes but does not dictate when to use them.

| Token                     | Value |
| ------------------------- | ----: |
| `ref.font.size.xxsmall`   |  10px |
| `ref.font.size.xsmall`    |  12px |
| `ref.font.size.small`     |  14px |
| `ref.font.size.default`   |  16px |
| `ref.font.size.medium`    |  16px |
| `ref.font.size.large`     |  20px |
| `ref.font.size.xlarge`    |  30px |
| `ref.font.size.xxlarge`   |  36px |
| `ref.font.size.huge`      |  50px |
| `ref.font.size.ginormous` |  64px |

## Styles

Style refers to specific semantic treatments that can take on a variety of names, weights, and colors.

### Hero Style

A hero is the equivalent of a billboard in the physical world. It is intended as an attention-grabbing style usually paired with a strong, enticing message. Like a Page Title, it is most commonly found at the top of a page or view. Unlike a Page Title, it is not used to describe the main purpose of the page.

| Token                                | Value     |
| ------------------------------------ | --------- |
| `lightmode.-content.hero.color`      | `#191A1A` |
| `lightmode.-content.hero.fontSize`   | `64px`    |
| `lightmode.-content.hero.fontWeight` | `300`     |
| `lightmode.-content.hero.lineHeight` | `1.5`     |

### Page Title Style

Tokenized as `pageTitle`, the Page Title style is designed to be used at the top of a page or view, describing the content on the page.

| Token                                     | Value     |
| ----------------------------------------- | --------- |
| `lightmode.-content.pageTitle.color`      | `#191A1A` |
| `lightmode.-content.pageTitle.fontSize`   | `50px`    |
| `lightmode.-content.pageTitle.fontWeight` | `600`     |
| `lightmode.-content.pageTitle.lineHeight` | `1.5`     |

### Heading Large Style

Heading Large is the next highest hierarchical section or topic below a Page Title. It appears smaller than a Page Title and larger than a Heading.

| Token                                     | Value     |
| ----------------------------------------- | --------- |
| `lightmode.-content.heading.color`        | `#191A1A` |
| `lightmode.-content.heading.fontSize`     | `30px`    |
| `lightmode.-content.heading.fontWeight`   | `500`     |
| `lightmode.-content.heading.lineHeight`   | `1.5`     |
| `lightmode.-content.heading.marginBottom` | `32px`    |

### Heading Style

This style is for the next highest hierarchical section or topic below a Heading Large. It appears smaller than Heading Large and larger than Subheading.

| Token                                     | Value     |
| ----------------------------------------- | --------- |
| `lightmode.-content.heading.color`        | `#191A1A` |
| `lightmode.-content.heading.fontSize`     | `30px`    |
| `lightmode.-content.heading.fontWeight`   | `500`     |
| `lightmode.-content.heading.lineHeight`   | `1.5`     |
| `lightmode.-content.heading.marginBottom` | `32px`    |

### Subheading Style

This style is for the next highest hierarchical section or topic below a Heading. It appears smaller than Heading and larger than a Paragraph.

| Token                                        | Value                 |
| -------------------------------------------- | --------------------- |
| `lightmode.-content.subheading.color`        | `#191A1A`             |
| `lightmode.-content.subheading.fontSize`     | `20px`                |
| `lightmode.-content.subheading.fontWeight`   | `525` variable weight |
| `lightmode.-content.subheading.lineHeight`   | `1.5`                 |
| `lightmode.-content.subheading.marginBottom` | `32px`                |

### Paragraph

Self-explanatory, this style is for paragraphs of text or copy.

| Token                                       | Value     |
| ------------------------------------------- | --------- |
| `lightmode.-content.paragraph.color`        | `#191A1A` |
| `lightmode.-content.paragraph.fontSize`     | `16px`    |
| `lightmode.-content.paragraph.fontWeight`   | `400`     |
| `lightmode.-content.paragraph.lineHeight`   | `1.5`     |
| `lightmode.-content.paragraph.marginBottom` | `24px`    |

### Common

Common refers to the first choice for all content, used for body in HTML or default text in other applications.

| Token                                         | Value     |
| --------------------------------------------- | --------- |
| `lightmode.-content.common.fontSize`          | `16px`    |
| `lightmode.-content.common.fontWeight`        | `400`     |
| `lightmode.-content.common.lineHeight`        | `1.5`     |
| `lightmode.-content.common.textColor.default` | `#191A1A` |
| `lightmode.-content.common.textColor.reverse` | `#FFFFFF` |

### Heavy

Heavy is a semi-bolded version of the common or paragraph style.

| Token                                 | Value     |
| ------------------------------------- | --------- |
| `lightmode.-content.heavy.color`      | `#191A1A` |
| `lightmode.-content.heavy.fontSize`   | `16px`    |
| `lightmode.-content.heavy.fontWeight` | `600`     |
| `lightmode.-content.heavy.lineHeight` | `1.5`     |

### Microcopy

Microcopy refers to small, helpful text that aids the user in making progress through a form or application.

| Token                                     | Value     |
| ----------------------------------------- | --------- |
| `lightmode.-content.microcopy.color`      | `#646768` |
| `lightmode.-content.microcopy.fontSize`   | `12px`    |
| `lightmode.-content.microcopy.fontWeight` | `400`     |
| `lightmode.-content.microcopy.lineHeight` | `1.75`    |

### Nanoheading

A nanoheading is a small, all-caps heading with less emphasis than other heading types used to label a list, group, or feature.

| Token                                       | Value       |
| ------------------------------------------- | ----------- |
| `lightmode.-content.nanoheading.color`      | `#646768`   |
| `lightmode.-content.nanoheading.fontSize`   | `12px`      |
| `lightmode.-content.nanoheading.fontWeight` | `575`       |
| `lightmode.-content.nanoheading.letterCase` | `uppercase` |
| `lightmode.-content.nanoheading.lineHeight` | `1.55`      |

### Nanocopy

Nanocopy is smaller than microcopy and refers to helpful text that aids the user in making progress through a form or application.

| Token                                    | Value                 |
| ---------------------------------------- | --------------------- |
| `lightmode.-content.nanocopy.color`      | `#646768`             |
| `lightmode.-content.nanocopy.fontSize`   | `12px`                |
| `lightmode.-content.nanocopy.fontWeight` | `450` variable weight |
| `lightmode.-content.nanocopy.lineHeight` | `1.5`                 |

## Accessibility

### Text Spacing

- Line height: minimum `1.5x` font size.
- Spacing after paragraphs: minimum `2x` font size.
- Letter spacing, or tracking: minimum `0.12x` font size.
- Word spacing: minimum `0.16x` font size.

### Contrast

For medium-weight body copy, the following contrast between font color and background is required:

- Minimum `4.5:1` for normal text.
- Minimum `3:1` for large text, defined as `18px` or `14px` bold.
