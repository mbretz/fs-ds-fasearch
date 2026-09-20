import { RadioGroup, SegmentedControl } from 'ds';
import { List, Map } from 'icons';
import { cn } from '../../utils/cn';

export type ResultsView = 'list' | 'map' | 'dual';

interface ResultsToolbarProps {
  resultsCount: number;
  view: ResultsView;
  onViewChange: (view: ResultsView) => void;
  className?: string;
}

// Matches Figma's tablet/desktop "Results (N) + view switcher" row
// (`1630:38760`) and its separate mobile composition (`1350:33312`) --
// two different DS components per device class (SegmentedControl vs
// RadioGroup/RadioButton), not one component reskinned, per
// docs/PLAN.md's own Results-page spec. Both blocks stay mounted
// simultaneously (`hidden`/`md:hidden` toggling which is visible), same
// dual-mount convention AdvisorSearchModule's Start/InProgress stages and
// FilterFacets already use for a device-class (not component-width)
// layout decision, rather than a container query.
//
// "Dual View" has no icon in Figma's SegmentedControl instance (`Show
// Icon Start: false`, unlike List/Map) -- `SegmentedControl.Trigger`'s
// `icon` prop is simply omitted for it here, not passed as `undefined`.
//
// Map/Dual views render as inert placeholder text for now (see
// ResultsList's own caller in Results.tsx) -- only List has real content
// built out yet, per the user.
export function ResultsToolbar({
  resultsCount,
  view,
  onViewChange,
  className,
}: ResultsToolbarProps) {
  return (
    <div className={cn(className)}>
      {/* Tablet/desktop: `Results (N)` + SegmentedControl, side by side. */}
      <div className="hidden md:flex md:items-end md:justify-between">
        <span className="text-[length:var(--semantic-content-subheading-font-size)] leading-[length:var(--semantic-content-subheading-line-height)] font-[number:var(--semantic-content-subheading-font-weight)] text-[color:var(--semantic-content-common-text-color-default)]">
          Results ({resultsCount})
        </span>
        <SegmentedControl.Root
          value={view}
          onValueChange={(next) => onViewChange(next as ResultsView)}
          density="condensed"
        >
          <SegmentedControl.List>
            <SegmentedControl.Trigger value="list" icon={<List />}>
              List View
            </SegmentedControl.Trigger>
            <SegmentedControl.Trigger value="map" icon={<Map />}>
              Map View
            </SegmentedControl.Trigger>
            <SegmentedControl.Trigger value="dual">
              Dual View
            </SegmentedControl.Trigger>
          </SegmentedControl.List>
        </SegmentedControl.Root>
      </div>

      {/* Mobile: `Results (N)` heading and the radio-button pair share one
          row once this row's own width clears 548px (`@container`/
          `@[548px]:`, not a viewport breakpoint -- same convention
          AdvisorSearchModule/Start.tsx use for width-driven, not
          device-class, layout decisions), and stack below that -- no
          Dual View option, per Figma/docs/PLAN.md. 548px is 580px
          (the *viewport* width the user asked to switch at) minus this
          row's fixed 32px of horizontal margin (16px each side, from
          this component's own `mx-[…layout-fixed-large]` className prop
          -- see Results.tsx) -- that margin is the only thing between
          this container and the viewport edge below `md`, so the offset
          is constant and this threshold reproduces the requested
          viewport breakpoint exactly. A 3-column `1fr auto 1fr` grid
          (not flex) keeps the radio-button pair centered in the row's
          full width independent of the heading's text length, per the
          user -- the empty 3rd column balances the 1st so the
          auto-sized 2nd column lands dead center; below the threshold
          it collapses back to one column, so `justify-self-start`/
          `-center` on the two children reproduce the same stacked,
          centered-pair look as before.
          `view === 'dual'` can only be selected on tablet/desktop, but
          stays possible in state if the viewport narrows afterward --
          falls back to `list` here so a radio option is always shown as
          selected rather than neither. */}
      {/* `@container` has to live on a wrapper distinct from the grid it
          sizes -- CSS containment scopes a container query to a
          container's *descendants*, never the container element itself,
          so putting both on one div silently never re-triggers it. */}
      <div className="@container md:hidden">
        <div className="grid grid-cols-1 items-center gap-[var(--density-spacing-fixed-small)] @[548px]:grid-cols-[1fr_auto_1fr]">
          <span className="ml-[var(--density-layout-fixed-xx-large)] justify-self-start whitespace-nowrap text-[length:var(--semantic-content-heavy-font-size)] leading-[length:var(--semantic-content-heavy-line-height)] font-[number:var(--semantic-content-heavy-font-weight)] text-[color:var(--semantic-content-common-text-color-default)]">
            Results ({resultsCount})
          </span>
          <RadioGroup.Root
            value={view === 'dual' ? 'list' : view}
            onValueChange={(next) => onViewChange(next as ResultsView)}
            className="flex items-center justify-self-center"
          >
            <RadioGroup.Item value="list">List View</RadioGroup.Item>
            <RadioGroup.Item value="map">Map View</RadioGroup.Item>
          </RadioGroup.Root>
        </div>
      </div>
    </div>
  );
}
