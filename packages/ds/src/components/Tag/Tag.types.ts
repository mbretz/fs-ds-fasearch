import type { ComponentProps, ReactNode } from 'react';

// No `density` prop — Tag is deliberately not density-aware; `size` is its
// only sizing axis (docs/PLAN.md §1.6, established 2026-08-19 on Tag).
export interface TagRootProps extends ComponentProps<'span'> {
  size?: 'sm' | 'lg';
  /** Preset color style; named `variant` to avoid colliding with `data-theme`. */
  variant?: 'generic' | 'teal' | 'red' | 'gold';
  /**
   * Visual border-width step. The real border stays fixed and an inset
   * box-shadow makes up the visual difference (same trick as Button's focus
   * ring / Tabs' active border), so box height never moves.
   */
  borderWidth?: 'default' | 'heavy';
  asChild?: boolean;
}

export type TagLabelProps = ComponentProps<'span'>;

/**
 * Convenience wrapper for the text-only case. Content before/after the
 * label — an icon, a dot, a count — is added by composing Tag.Root/.Label
 * directly instead: `<Tag.Root><Icon /><Tag.Label>...</Tag.Label></Tag.Root>`.
 */
export interface TagProps extends TagRootProps {
  children: ReactNode;
}
