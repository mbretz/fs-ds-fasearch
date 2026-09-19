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

      {/* Mobile: `Results (N)` heading above a centered radio-button pair --
          no Dual View option, per Figma/docs/PLAN.md. `view === 'dual'`
          can only be selected on tablet/desktop, but stays possible in
          state if the viewport narrows afterward -- falls back to `list`
          here so a radio option is always shown as selected rather than
          neither. */}
      <div className="flex flex-col gap-[var(--density-spacing-fixed-small)] md:hidden">
        <span className="text-[length:var(--semantic-content-heavy-font-size)] leading-[length:var(--semantic-content-heavy-line-height)] font-[number:var(--semantic-content-heavy-font-weight)] text-[color:var(--semantic-content-common-text-color-default)]">
          Results ({resultsCount})
        </span>
        <RadioGroup.Root
          value={view === 'dual' ? 'list' : view}
          onValueChange={(next) => onViewChange(next as ResultsView)}
          className="flex w-full items-center justify-center"
        >
          <RadioGroup.Item value="list">List View</RadioGroup.Item>
          <RadioGroup.Item value="map">Map View</RadioGroup.Item>
        </RadioGroup.Root>
      </div>
    </div>
  );
}
