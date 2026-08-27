---
title: 'Color'
---

# Color

This design system's brand and user interface color system.

## Primary Brand Colors

This section defines the role of primary brand colors, explains appropriate use, and separates brand expression from semantic UI colors, once a brand palette is approved.

## Thinking About Color

Color is more than an aesthetic choice. It's a communication tool. When everything is colorful, nothing stands out, and any meaning associated with color dissolves into noise. Restraint allows color to speak.

The color system is built on a philosophy of intentional and thoughtful use of color to maintain consistency, improve accessibility, and meet diverse design needs.

## Semantic Color Usage

Within this design system, color is used semantically to improve usability across the digital ecosystem. By assigning names based on function rather than appearance, this approach creates a more intuitive and consistent way to apply color. These semantic names are tokens.

## Semantic Token Groups

### Action Tokens

Action tokens apply to UI elements designed to initiate specific events or requests that trigger changes in the application's state or data. Examples include buttons, links, and other elements that empower users to take actions.

Common action tokens include default, hover, and disabled colors for primary, secondary, and tertiary states.

### Content Tokens

Content tokens apply to UI elements intended to present information and visual content to users. They cover data, textual content, images, multimedia, callouts, banners, and other forms of visual or textual content.

Common content tokens include text color, reverse text color, heading color, paragraph color, page title color, microcopy color, nanoheading color, and nanocopy color.

### Control Tokens

Control tokens apply to UI elements where users manage and manipulate the application or its content. Examples include input, select, radio, checkbox, and other form controls.

Common control tokens include background color, border color, text color, active and inactive accent colors, and disabled colors.

### Layout Tokens

Layout tokens apply to treatments that holistically impact a page or view, including page-level background colors, spacing between sections, and grids.

### Response Tokens

Response tokens apply to components that provide feedback based on user interactions or actions. They convey user-action outcomes, system status updates, and error messages. Inline notification, confirmation dialog, and file upload components frequently use these tokens.

Common response groups include critical, neutral, success, and warning colors.

### Surface Tokens

Surface tokens apply to containers upon which buttons, text, and other UI elements are displayed, such as cards. A surface is akin to a canvas in art, providing a distinct area for interface components. Surfaces can vary in depth, elevation, or texture to create visual hierarchy and improve user experience.

## Incorrect Color Usage

- Do not choose colors based on personal preference. Align with standards, especially semantic standards.
- Do not use too many colors for the same information.
- Do not use brand colors as color overlays on top of imagery.
- Do not use colors to create a pattern or texture.
- Do not use gradients of the color palette.
- Do not use colors that are not in the color palette.
- Do not use colors that do not provide enough contrast with typography or other important information.

## Key Semantic Color Tokens

| Token                                         | Value     |
| --------------------------------------------- | --------- |
| `lightmode.-action.color.default`             | `#006DA3` |
| `lightmode.-action.color.hover.default`       | `#004B70` |
| `lightmode.-action.color.hover.secondary`     | `#F0FAFF` |
| `lightmode.-content.common.textColor.default` | `#191A1A` |
| `lightmode.-content.common.textColor.reverse` | `#FFFFFF` |
| `lightmode.-content.microcopy.color`          | `#646768` |
| `lightmode.-control.backgroundColor`          | `#FFFFFF` |
| `lightmode.-control.borderColor`              | `#7D8082` |
| `lightmode.-control.accentColor.active`       | `#006DA3` |
| `lightmode.-layout.backgroundColor.primary`   | `#F0FAFF` |
| `lightmode.-layout.backgroundColor.secondary` | `#F7F7F7` |
| `lightmode.-layout.backgroundColor.tertiary`  | `#FFFAE5` |
| `lightmode.-response.color.critical.primary`  | `#CB0B31` |
| `lightmode.-response.color.success.primary`   | `#247E58` |
| `lightmode.-response.color.warning.primary`   | `#D13805` |
| `lightmode.-surface.borderColor`              | `#7D8082` |
| `lightmode.-surface.backgroundColor.primary`  | `#FFFFFF` |
| `lightmode.-surface.backgroundColor.reverse`  | `#323334` |
