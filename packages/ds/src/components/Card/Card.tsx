import type { ComponentPropsWithoutRef, Ref } from 'react';
import { Collapsible as CollapsiblePrimitive, Slot } from 'radix-ui';
import { CaretDown } from 'icons';
import { cn } from '../../utils/cn';
import type {
  CardRootProps,
  CardHeaderProps,
  CardHeaderTitleProps,
  CardHeaderDescriptionProps,
  CardBodyProps,
  CardFooterProps,
} from './Card.types';

// Radix Collapsible.Root always establishes the open/closed context, even
// for a plain (non-expandable) Card — that's what lets Card.Body/.Footer
// share one collapse mechanism without every Card needing to opt in.
// `asChild` merges Root's own behavior onto CardRoot's real element instead
// of adding an extra wrapper div; a second, consumer-facing `asChild` (via
// Slot) lets the rendered tag itself still be swapped (e.g. to <section>).
function CardRoot({
  className,
  asChild,
  density,
  open,
  defaultOpen = true,
  onOpenChange,
  disabled,
  children,
  ref,
  ...props
}: CardRootProps) {
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <CollapsiblePrimitive.Root
      asChild
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      disabled={disabled}
    >
      <Comp
        ref={ref}
        data-density={density}
        className={cn(
          'flex min-w-[var(--component-card-min-width)] flex-col rounded-[var(--component-card-border-radius)] border-[length:var(--component-card-border-width)] border-[color:var(--component-card-border-color)] bg-[var(--component-card-background-color)]',
          className,
        )}
        {...props}
      >
        {children}
      </Comp>
    </CollapsiblePrimitive.Root>
  );
}
CardRoot.displayName = 'Card.Root';

// The bottom border (`--component-card-header-border-*`) is gated by
// `showBorder` (default true) in both branches: on a non-expandable header
// it's static (Figma's original design always showed it there); on an
// expandable header it's still tied to data-[state=open] on top of that,
// so `showBorder={false}` disables it outright in either case.
function CardHeader({
  className,
  expandable,
  showBorder = true,
  children,
  ref,
  ...props
}: CardHeaderProps) {
  const rowClassName = cn(
    'group flex items-center gap-[var(--component-card-header-gap)] p-[var(--component-card-header-padding)]',
    expandable && 'cursor-pointer outline-none',
    showBorder &&
      (expandable
        ? 'data-[state=open]:border-b-[length:var(--component-card-header-border-border-width)] data-[state=open]:border-b-[color:var(--component-card-header-border-border-color)]'
        : 'border-b-[length:var(--component-card-header-border-border-width)] border-b-[color:var(--component-card-header-border-border-color)]'),
    className,
  );

  if (!expandable) {
    return (
      <div ref={ref as Ref<HTMLDivElement>} className={rowClassName} {...props}>
        {children}
      </div>
    );
  }

  return (
    <CollapsiblePrimitive.Trigger
      ref={ref as Ref<HTMLButtonElement>}
      className={rowClassName}
      {...(props as ComponentPropsWithoutRef<'button'>)}
    >
      {children}
      <CaretDown
        aria-hidden
        className="ml-auto size-[var(--component-card-header-control-icon-size)] shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180"
      />
    </CollapsiblePrimitive.Trigger>
  );
}
CardHeader.displayName = 'Card.Header';

function CardHeaderTitle({
  className,
  icon,
  children,
  ref,
  ...props
}: CardHeaderTitleProps) {
  return (
    <div
      ref={ref}
      className={cn(
        'flex min-w-0 flex-1 items-center gap-[var(--component-card-header-gap)]',
        className,
      )}
      {...props}
    >
      {icon && (
        <span className="size-[var(--component-card-header-icon-size)] shrink-0 [&>svg]:size-full">
          {icon}
        </span>
      )}
      <span className="min-w-0 truncate text-[length:var(--component-card-header-title-font-size)] font-[number:var(--component-card-header-title-font-weight)] text-[color:var(--component-card-header-title-text-color)]">
        {children}
      </span>
    </div>
  );
}
CardHeaderTitle.displayName = 'Card.HeaderTitle';

function CardHeaderDescription({
  className,
  ref,
  ...props
}: CardHeaderDescriptionProps) {
  return (
    <div
      ref={ref}
      className={cn(
        'min-w-0 text-[length:var(--component-card-header-description-font-size)] font-[number:var(--component-card-header-description-font-weight)] text-[color:var(--component-card-header-description-text-color)]',
        className,
      )}
      {...props}
    />
  );
}
CardHeaderDescription.displayName = 'Card.HeaderDescription';

// forceMount + a CSS grid-rows collapse keeps Body/Footer mounted in the
// DOM at all times (per explicit user direction) instead of Radix's
// default Presence-driven unmount, while still collapsing visually and
// staying in sync with Card.Header's trigger via the shared Root context.
//
// Three nested layers, not two — padding lives on the innermost div, not
// the grid item itself. Padding on the item that's directly stretched to
// the animated 0fr row can leave a residual gap at fully closed (the
// padding box doesn't reliably clip to 0 with it), so a dedicated
// `overflow-hidden`/`min-h-0` wrapper with no padding of its own sits
// between the grid row and the padded content, guaranteeing a full
// collapse to 0.
//
// `invisible`/`visibility` (not `hidden`): forceMount makes Radix's own
// `hidden: !isOpen` on this element always false, so nothing excludes
// collapsed content from the a11y tree or tab order on its own —
// `visibility:hidden` does both, and `data-[state=closed]:delay-200`
// defers it until the grid-rows collapse animation finishes so content
// doesn't vanish mid-animation.
function CardBody({ className, children, ref, ...props }: CardBodyProps) {
  return (
    <CollapsiblePrimitive.Content
      forceMount
      className="invisible grid grid-rows-[0fr] overflow-hidden transition-[grid-template-rows,visibility] duration-200 ease-out data-[state=closed]:delay-200 data-[state=open]:visible data-[state=open]:grid-rows-[1fr]"
    >
      <div className="min-h-0 overflow-hidden">
        <div
          ref={ref}
          className={cn('p-[var(--component-card-body-padding)]', className)}
          {...props}
        >
          <div className="flex flex-col gap-[var(--component-card-body-gap)]">
            {children}
          </div>
        </div>
      </div>
    </CollapsiblePrimitive.Content>
  );
}
CardBody.displayName = 'Card.Body';

function CardFooter({ className, children, ref, ...props }: CardFooterProps) {
  return (
    <CollapsiblePrimitive.Content
      forceMount
      className="invisible grid grid-rows-[0fr] overflow-hidden transition-[grid-template-rows,visibility] duration-200 ease-out data-[state=closed]:delay-200 data-[state=open]:visible data-[state=open]:grid-rows-[1fr]"
    >
      <div className="min-h-0 overflow-hidden">
        <div
          ref={ref}
          className={cn('p-[var(--component-card-footer-padding)]', className)}
          {...props}
        >
          <div className="flex flex-col gap-[var(--component-card-footer-gap)]">
            {children}
          </div>
        </div>
      </div>
    </CollapsiblePrimitive.Content>
  );
}
CardFooter.displayName = 'Card.Footer';

export const Card = {
  Root: CardRoot,
  Header: CardHeader,
  HeaderTitle: CardHeaderTitle,
  HeaderDescription: CardHeaderDescription,
  Body: CardBody,
  Footer: CardFooter,
};
