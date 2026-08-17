import { cloneElement, isValidElement } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'icons';
import { cn } from '../../utils/cn';
import { Link } from '../Link/Link';
import type { LinkNavigationProps } from './LinkNavigation.types';

const iconAlignClassName = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
} as const;

// Figma nests the chevron outside the Link instance as a sibling — a
// Figma constraint (no true slot primitive for merging content into a
// nested instance), not real design intent. Code renders the chevron as a
// child of Link itself, so the whole hit target (chevron + text) is one
// interactive element, same as an asChild swap to <button> would need.
function LinkNavigation({
  direction,
  iconAlign = 'center',
  asChild,
  children,
  className,
  ref,
  ...props
}: LinkNavigationProps) {
  const chevron =
    direction === 'previous' ? (
      <ChevronLeft
        aria-hidden="true"
        className="size-[var(--component-link-icon-size-large)] shrink-0"
      />
    ) : (
      <ChevronRight
        aria-hidden="true"
        className="size-[var(--component-link-icon-size-large)] shrink-0"
      />
    );

  const content = (
    <>
      {direction === 'previous' && chevron}
      {asChild && isValidElement(children)
        ? (children as ReactElement<{ children?: ReactNode }>).props.children
        : children}
      {direction === 'next' && chevron}
    </>
  );

  // Slot requires exactly one child element, so when asChild is used the
  // chevron has to be injected into the consumer's own element (cloned),
  // not rendered alongside it as a second child.
  const linkChildren =
    asChild && isValidElement(children)
      ? cloneElement(children, undefined, content)
      : content;

  return (
    <Link
      ref={ref}
      asChild={asChild}
      underline={false}
      className={cn(
        'inline-flex gap-[var(--component-link-icon-gap)]',
        iconAlignClassName[iconAlign],
        className,
      )}
      {...props}
    >
      {linkChildren}
    </Link>
  );
}
LinkNavigation.displayName = 'LinkNavigation';

export { LinkNavigation };
