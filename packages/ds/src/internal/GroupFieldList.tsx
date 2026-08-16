import { cva } from 'class-variance-authority';
import { cn } from '../utils/cn';
import type { GroupFieldListProps } from './GroupFieldList.types';

/**
 * Shared "bordered options slot" shell used by both ChecklistGroup and
 * RadioGroup — confirmed via direct Figma re-fetch of both component sets
 * (92:691, 111:926) that the label -> slot -> microcopy composition and the
 * slot's own error-state recoloring are pixel-identical between the two,
 * down to sharing the same literal `borderRadius` value. Every color/radius
 * here reads from the local `--group-field-*` custom properties rather than
 * a `component-checklistGroup-*`/`component-radioGroup-*` name directly —
 * Tailwind's class scanner needs a literal, static utility string per class
 * (arbitrary values built from a dynamic prop/template string never get
 * generated), so each consumer sets these three custom properties via an
 * inline `style` pointing at its own component tokens instead of this file
 * hardcoding one consumer's token names. Neither Figma component set shares
 * a token bucket with the other despite matching values (same precedent as
 * TextInput vs. TextArea's separate-but-identical hand-added tokens, see
 * packages/tokens/HAND_ADDED_TOKENS.md).
 *
 * The pink slot fill visible in the raw Figma frame data (`#FFF0F3`) is
 * Figma's own placeholder shading for an empty component slot, not an
 * authored error style — confirmed with the user rather than assumed. The
 * real error background is `--color-response-critical-subtle`, which is
 * coincidentally the same hex, wired in by each consumer below.
 */
export const groupFieldListVariants = cva(
  'rounded-[var(--group-field-border-radius)] border-[length:var(--semantic-control-border-width-default)]',
  {
    variants: {
      orientation: {
        // items-start: rows hug their own content width (Figma's `sizing:
        // hug`) instead of stretching, which would make a row's own
        // justify-center visibly center it across the group's width.
        vertical: 'flex flex-col items-start',
        horizontal: 'flex flex-row flex-wrap',
      },
      error: {
        true: 'border-[color:var(--group-field-border-color)] bg-[var(--group-field-background-color)]',
        false: 'border-transparent bg-transparent',
      },
    },
    defaultVariants: {
      orientation: 'vertical',
      error: false,
    },
  },
);

function GroupFieldList({
  className,
  density,
  orientation = 'vertical',
  error = false,
  ref,
  ...props
}: GroupFieldListProps) {
  return (
    <div
      ref={ref}
      data-density={density}
      className={cn(groupFieldListVariants({ orientation, error }), className)}
      {...props}
    />
  );
}
GroupFieldList.displayName = 'GroupFieldList';

export { GroupFieldList };
