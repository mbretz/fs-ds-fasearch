---
title: 'Avatar'
---

# Avatar

An avatar is a symbolic image or icon that stands in for a user or entity.

## Guidelines

Avatars condense information into a visually efficient form, save screen space, and add a personal touch when a user or entity is represented.

An avatar consists of a container filled with content representing the user or entity. If the content is an image, the image fills the container. If the content is initials, display the initials against a colored background. If no image is supplied or the image fails to load, default to initials. If there is no associated user or entity, use the generic avatar icon.

- Pair avatars with a visible label when possible.
- If an avatar is presented without a visible label, provide an accessible name that identifies the represented user or entity.
- Use a circular shape for individuals and a rounded square (`variant="entity"`, 16px border-radius) for entities — not a literal square.
- Size avatars according to context, following the same base sizing logic used for icons.

## Accessibility

Wiring an accessible label onto the avatar is the consumer's responsibility, not automatic — `AvatarFallback`/`AvatarImage` spread `...props` straight through, so pass `aria-label` (fallback) or `alt` (image) yourself to communicate the represented user or entity to assistive technology. If the avatar is part of a button or other actionable element, a visible label is usually the best approach for speech recognition users.

## Supporting research

Usability labs with office teams found that the new avatar designs were preferred over the existing Message Center icons, with no significant usability concerns.

## Related

- [Design system overview](../../../README.md)
- [Accessibility standards](../../../specs/standards/accessibility-standards.md)
- [Sizing](../../../specs/style-foundations/sizing.md)
