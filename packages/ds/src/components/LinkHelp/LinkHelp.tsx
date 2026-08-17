import { Slot } from 'radix-ui';
import { HelpQuestionMark } from 'icons';
import { cn } from '../../utils/cn';
import type { LinkHelpProps } from './LinkHelp.types';

// Figma's Link - Help (167:5273) has no Underline/Visited axes at all —
// unlike Link, it's never underlined and has no :visited concept, so
// neither is exposed as a prop here.
//
// items-start (not items-center) + line-height pinned to the icon's own
// size: a single line of text is then exactly as tall as the icon, so
// top-aligning them is centering them — true for both a single-line label
// and a wrapped one, where later lines just extend downward without
// pulling the icon away from the top.
function LinkHelp({
  className,
  asChild,
  children,
  ref,
  ...props
}: LinkHelpProps) {
  const Comp = asChild ? Slot.Root : 'a';
  return (
    <Comp
      ref={ref}
      className={cn(
        'inline-flex items-start no-underline text-[length:var(--component-link-font-size-help)] leading-[length:var(--component-link-icon-size-large)] font-[number:var(--component-link-font-weight-help)] text-[color:var(--component-link-text-color-default)] hover:text-[color:var(--component-link-text-color-hover)] hover:bg-[var(--component-link-background-color-hover)]',
        className,
      )}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          <HelpQuestionMark
            aria-hidden="true"
            className="mr-[var(--component-link-icon-gap)] size-[var(--component-link-icon-size-large)] shrink-0"
          />
          {children}
        </>
      )}
    </Comp>
  );
}
LinkHelp.displayName = 'LinkHelp';

export { LinkHelp };
