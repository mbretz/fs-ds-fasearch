---
title: 'Elevation'
---

# Elevation

Elevation defines how items stack within an interface.

## Why Elevation Matters

Elevation helps users understand:

- What takes priority.
- How elements are layered and ordered.

## Stack Order

| Level | Elevation    | Definition                                                                                |
| ----: | ------------ | ----------------------------------------------------------------------------------------- |
|     0 | Baseplate    | Outside stack: the absolute background of the interface.                                  |
|     1 | Carved       | Lowest elevation: elements recessed into their parent surface, giving a carved-in effect. |
|     2 | Settled      | Static, low-elevation modules that appear almost flat.                                    |
|     3 | Resting      | Standard elevation for most modules and interactive surfaces.                             |
|     4 | Raised       | Contextual elements that need to feel closer to the user.                                 |
|     5 | Suspended    | Workflow-blocking elements that hover above most surfaces.                                |
|     6 | Floating     | Detached, transient elements tied to context.                                             |
|     7 | Levitating   | High-elevation elements above floating surfaces.                                          |
|     8 | Transcending | Highest elevation.                                                                        |

## Shadows

Shadows reinforce elevation by behaving as they do in the real world. Shadows are not applied directly to the Baseplate, but to Modules and interactive elements that exist above it.

## Shadow Anatomy

Shadows consist of three distinct parts: umbra, penumbra, and antumbra. This system defines umbra and penumbra values.

## Shadow Colors

Shadows take on the hue of the surface the shadow is cast upon. For this reason, leverage neutral colors and luminosity blend modes to get more accurate colors.

**Key principle:** Don't use pure black for shadow colors.

## Applying Shadows In Figma

1. Select the layer or component you want to apply the shadow to. In the Layout panel, ensure Clip Content is turned on.
2. In the right-hand sidebar, scroll to the Effects section beneath Fill and Stroke.
3. Click the Apply styles icon next to Effects and locate the Elevation and Shadows group, which includes numbered styles from 1 through 8.
4. Click the desired shadow style to apply it to the selected layer or component.
