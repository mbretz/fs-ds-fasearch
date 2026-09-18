import { useLayoutEffect, useRef, useState } from 'react';
import { Chip } from 'ds';
import { cn } from '../../utils/cn';

interface FilterFacetsProps {
  selectedFocusAreas: string[];
  onSelectedFocusAreasChange: (next: string[]) => void;
  className?: string;
}

// Tablet/desktop only (the planned selected-focus-area chip row, see
// Results.tsx/InProgress.tsx's own comments) -- a device-class call, not a
// component-width one, so `md:` (viewport) rather than a container query,
// per modern-web-guidance's own container-vs-media-query heuristic.
//
// Never unmounts, even with zero selected areas -- deliberately, on two
// counts: an unmount on the last dismiss would hard-cut straight past the
// motion-safe height transition below instead of animating to zero first,
// and staying mounted is what lets the reduced-motion two-row space stay
// reserved at all times (not just once at least one filter is selected),
// which is the actual point of reserving it -- a user who's opted out of
// motion shouldn't see layout shift when the *first* filter is added
// either, only once it's already showing something.
export function FilterFacets({
  selectedFocusAreas,
  onSelectedFocusAreasChange,
  className,
}: FilterFacetsProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [measuredHeight, setMeasuredHeight] = useState<number | null>(null);

  // A plain CSS transition can't interpolate to/from `auto` at all, and
  // (measured directly -- see FilterFacets' own history) `interpolate-size:
  // allow-keywords` doesn't help here either: it only animates an explicit
  // change to the *declared* value (e.g. a class toggle), not `block-size:
  // auto` sitting still while content reflows underneath it, which is
  // exactly this case (chips added/removed, no declared-value change) --
  // real-browser measurement showed it jumping instantly with zero
  // interpolated frames. So this measures the row's real post-reflow
  // height on every add/remove (including down to 0, when the last chip is
  // dismissed) and drives the transition between two concrete pixel values
  // instead, which measurement confirmed does actually interpolate.
  useLayoutEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const observer = new ResizeObserver(([entry]) => {
      setMeasuredHeight(entry.target.getBoundingClientRect().height);
    });
    observer.observe(row);
    return () => observer.disconnect();
  }, []);

  function dismiss(area: string) {
    onSelectedFocusAreasChange(selectedFocusAreas.filter((a) => a !== area));
  }

  return (
    <div
      className={cn(
        // Horizontal inset matches SiteShell's own tablet+ `<main>` padding
        // -- the `layout` tier (page-level spacing), not `spacing` (this
        // component's own internal chip/label gaps just below) -- so this
        // row's edges line up with AdvisorSearchModule/ProspectPortal above
        // and below it rather than hugging the viewport/`<main>` edge.
        'mx-[var(--density-layout-fixed-xx-large)] hidden overflow-hidden motion-safe:transition-[block-size] motion-safe:duration-200 motion-safe:ease-out md:block',
        // Reduced motion: permanently reserve room for two chip rows (one
        // row's height -- line-height + block padding + border, all from
        // Chip's own component tokens -- times two, plus one row gap)
        // instead of animating, so dismissing a filter never produces a
        // visible reflow to begin with. Computed from tokens, not
        // measured, since it must hold even before the row below has ever
        // mounted/measured a height.
        'motion-reduce:min-h-[calc((var(--component-chip-line-height)+var(--component-chip-padding-block)*2+var(--component-chip-border-width)*2)*2+var(--density-spacing-fixed-small))]',
        className,
      )}
      style={
        measuredHeight !== null ? { blockSize: measuredHeight } : undefined
      }
    >
      <div
        ref={rowRef}
        className="flex flex-wrap items-center gap-[var(--density-spacing-fixed-small)]"
      >
        {/* Only rendered once there's something to show a label for -- an
            empty row (zero children) is what gives the ResizeObserver above
            a real 0px to measure, so the last dismiss animates all the way
            down to nothing instead of leaving a floating label behind. */}
        {selectedFocusAreas.length > 0 && (
          <span className="mr-[var(--density-spacing-fixed-small)] shrink-0 [font-family:var(--semantic-content-font-family)] text-[length:var(--semantic-content-microcopy-font-size)] leading-[length:var(--semantic-content-microcopy-line-height)] font-[number:var(--primitives-ref-font-weight-medium)] text-[color:var(--semantic-content-common-text-color-default)] italic">
            Advisors Focusing on:
          </span>
        )}
        {selectedFocusAreas.map((area) => (
          <Chip
            key={area}
            onDismiss={() => dismiss(area)}
            dismissLabel={`Remove ${area} filter`}
          >
            {area}
          </Chip>
        ))}
      </div>
    </div>
  );
}
