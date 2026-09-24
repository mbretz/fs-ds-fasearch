import { useState } from 'react';
import { CaretUp, LoginKey } from 'icons';
import type { NewClientStatus } from '../../data/locations';
import { statusMeta } from '../entity-info/statusMeta';
import { Badge } from '../entity-info/Badge';
import { cn } from '../../utils/cn';

const STATUSES = Object.keys(statusMeta) as NewClientStatus[];

function LegendRow({ status }: { status: NewClientStatus }) {
  const meta = statusMeta[status];
  return (
    <span className="flex w-full items-center gap-[var(--density-spacing-fixed-small)]">
      <Badge
        icon={meta.icon}
        colorVar={meta.borderColorVar}
        mode="inverse"
        className="size-[var(--density-sizing-fixed-large)]"
      />
      <span className="text-[length:var(--semantic-content-common-font-size)] leading-[length:var(--semantic-content-common-line-height)] font-[number:var(--semantic-content-common-font-weight)] text-[color:var(--semantic-content-common-text-color-default)] whitespace-nowrap">
        {meta.label}
      </span>
    </span>
  );
}

// Two distinct Figma components (`Key`, `Key-Mobile`), not one responsive
// component -- same `hidden`/`md:hidden` dual-mount convention
// ResultsToolbar.tsx already uses for a device-class (not component-
// width) layout decision, rather than a container query.
export function MapLegend({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'absolute top-[var(--density-spacing-fixed-small)] left-[var(--density-spacing-fixed-small)] z-index-popover',
        className,
      )}
    >
      {/* Desktop: always-expanded static row (Figma's "Key", 1080:23525). */}
      <div className="hidden items-center gap-[var(--density-spacing-fixed-large)] rounded-full border-[length:var(--component-tag-border-width)] border-[color:var(--semantic-content-common-text-color-subtle)] bg-[var(--semantic-surface-base-default)] px-[var(--density-spacing-fixed-large)] py-[var(--density-spacing-fixed-small)] md:flex">
        {STATUSES.map((status) => (
          <LegendRow key={status} status={status} />
        ))}
      </div>
      {/* Mobile: collapsible (Figma's "Key-Mobile", 1204:38868) -- plain
          local state, no sync with anything else on the page, per the
          user. */}
      <div className="md:hidden">
        <MobileLegend />
      </div>
    </div>
  );
}

function MobileLegend() {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isExpanded) {
    return (
      <button
        type="button"
        aria-label="Show map legend"
        onClick={() => setIsExpanded(true)}
        className="flex size-8 cursor-pointer items-center justify-center rounded-full border-[length:var(--component-tag-border-width)] border-[color:var(--semantic-content-common-text-color-subtle)] bg-[var(--semantic-surface-base-default)]"
      >
        <LoginKey aria-hidden="true" className="size-4" />
      </button>
    );
  }

  return (
    <div className="flex w-[232px] flex-col items-center gap-[var(--density-spacing-fixed-small)] rounded-[24px] border-[length:var(--component-tag-border-width)] border-[color:var(--semantic-content-common-text-color-subtle)] bg-[var(--semantic-surface-base-default)] p-[var(--density-spacing-fixed-small)]">
      <button
        type="button"
        aria-label="Hide map legend"
        onClick={() => setIsExpanded(false)}
        className="flex size-[18px] cursor-pointer items-center justify-center rounded-full"
      >
        <CaretUp aria-hidden="true" className="size-4" />
      </button>
      {STATUSES.map((status) => (
        <LegendRow key={status} status={status} />
      ))}
    </div>
  );
}
