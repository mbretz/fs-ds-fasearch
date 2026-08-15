import type { ComponentProps, ReactNode } from 'react';

export interface TextInputRootProps extends ComponentProps<'div'> {
  density?: 'roomy' | 'condensed';
}

/**
 * Figma's `Input` component set (121:1322) has a `State` axis
 * (Default/Error/Active/Read-Only) plus a separate `Disabled` boolean
 * defined only for `State=Default`. `Active` (focus) is never a prop —
 * it's pure `focus-within:` CSS, the same pseudo-class-stays-CSS-only
 * precedent as Button/SegmentedControl's `State=Idle/Hover`
 * (docs/FIGMA_COMPONENT_AUDIT.md). `error`, native `disabled`, and
 * native `readOnly` are real props; TextInput.tsx derives a single
 * visual state from them at render time (disabled takes precedence,
 * since Figma never defines Disabled+Error or Disabled+Read-Only
 * combinations).
 */
export interface TextInputFieldProps
  extends Omit<ComponentProps<'input'>, 'size'> {
  error?: boolean;
  /** Figma "Show Icon Start" (121:1322) — inline-start icon slot. */
  iconStart?: ReactNode;
  /** Figma "Show Icon End" (121:1322) — inline-end icon slot. */
  iconEnd?: ReactNode;
  density?: 'roomy' | 'condensed';
}
