/**
 * Overrides the default accessible name. Set this when the visible
 * label doesn't fully describe the action in context, or when the
 * component's label is visually hidden and the icon alone isn't enough.
 *
 * First instance of the shared-documented-prop-type convention —
 * see docs/PLAN.md §1.6 for the full pattern, including how components
 * with a more specific scenario opt out with their own local type.
 */
export type AriaLabelProp = { 'aria-label'?: string };
