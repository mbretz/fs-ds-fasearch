---
title: 'Surfaces'
---

# Surfaces

Surfaces structure and organize interfaces.

There are two main types of surfaces:

- The baseplate: the foundational surface for the entire layout.
- Modules: surfaces placed on or above the baseplate that contain content and interactivity.

## The Baseplate

AKA: Background, Body Container, Canvas, Artboard

The Baseplate is the foundational Surface. It is the absolute background of the interface and serves as the lowest layer above which all other surfaces, components, and content reside. The Baseplate provides a visual and contextual foundation for the interface, ensuring cohesion across the system.

### Why The Baseplate Is Important

1. Structural Foundation: establishes the base for the interface hierarchy.
2. Visual Consistency: ensures a unified background context and contrast between Modules.
3. Flexibility: allows adaptation for mode, campaign, and theme.

### How To Use The Baseplate

1. The Baseplate should provide a neutral foundation that supports content without distracting users.
2. Adjust the Baseplate's background to establish branding or mood, such as corporate identity or seasonal themes.
3. Content should rarely be placed directly on the Baseplate. Instead, use Module surfaces for organization and containment.

## Modules

AKA: Container, Content Block, Tile, Card, Panel

A Module is a Surface that organizes, contains, and structures Content and Components. Modules are the building blocks of the interface, enabling modularity, reusability, and clear hierarchy. They sit on the baseplate and can stack, move, and nest relative to their parent Surface.

### Modules Are Modular

- Modules are designed to be flexible, moveable, and nested without losing structure or usability.
- Modules enable consistent and flexible layouts, making interfaces adaptable to different contexts such as desktop, mobile, and embedded views.

### Responsiveness And Adaptation

- Modules adjust based on viewport size, but their expected behaviors and boundaries remain unchanged.
- Mobile adaptations should reflow Modules, not break their hierarchy.

### Basic Usage

1. Content and Components should live within Modules, not directly on the Baseplate.
2. Follow Elevation Rules.
3. Ensure padding and spacing are consistent to maintain visual clarity.

### Containment And Flexibility

- Modules expand to fit their primary content, such as growing text blocks or dynamic data.
- Modules do not expand for temporary interactive elements, such as drawers, dropdown menus, or tooltips.
- Whenever possible, avoid having temporary interactive elements overlap multiple Modules at once.
- Nested Modules are allowed and must remain visually distinct from their parent.
