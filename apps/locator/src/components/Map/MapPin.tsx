import { Avatar as AvatarIcon, BuildingGeneric } from 'icons';
import type { Location } from '../../data/locations';
import { getPinType } from './pinType';

export interface MapPinProps {
  location: Location;
  /** Figma's "inverse" pin treatment (node `2377:33147`), per the user,
   * 2026-09-25 -- driven by `Map.tsx`'s own `selectedLocationId` prop,
   * which (per its own doc comment) reflects the associated card being
   * selected in `ResultsList` (Dual view) just as much as the pin's own
   * popover being open; the popover itself is deliberately a separate
   * concern (`Map.tsx`'s own internal `popoverLocationId`), so a Dual
   * view list-row click can color its pin without also opening one.
   * Colors sampled directly
   * from Figma's own exported pixels (not eyeballed): the outer ring's
   * fill swaps from `#4B4D4E` to `#C08E16` (both still 60% opacity --
   * neither hex matches a real token, same "documented literal"
   * precedent as this component's own default-state colors below), the
   * inner circle's fill swaps from `#323334` to the existing gold
   * (`#FDE272`, no longer just a border), and the icon swaps from that
   * same gold to a near-black (`#191A1A`, matching `semantic-content-
   * common-text-color-default` -- confirmed via a second color pick,
   * not just an eyeballed "looks dark" guess). The border stays
   * `#FDE272` on both -- invisible against the inverse inner circle's
   * own now-identical fill, but harmless to leave in place rather than
   * conditionally dropping it. */
  selected?: boolean;
}

// Matches Figma's Map Pin component set (447:2009): a 44px dark,
// semi-transparent circle with a 32px inner circle centered inside,
// bordered in the same gold stroke (`#FDE272`) on every variant -- no
// token in packages/tokens/build/css/tokens.css matches that exact hex,
// so it's a documented literal here, same "no clean token, arbitrary
// value with a comment" precedent as AdvisorCard/StatusTag/EntityPortrait's
// own badge-size overrides.
//
// Both variants show a generic icon, not a specific advisor's photo or
// initials, per the user -- Figma's own Single pin is an icon-content
// Avatar (`1727:46147`, "Contents=Icon"), not a photo one. Single uses
// the `icons` package's generic "avatar" glyph; Branch uses
// `BuildingGeneric`. Multiple (a headcount instead of an icon) is
// reserved for a zoomed-out overlap-clustering case this Map doesn't
// implement -- see `pinType.ts`.
export function MapPin({ location, selected = false }: MapPinProps) {
  const type = getPinType(location);
  const Icon = type === 'single' ? AvatarIcon : BuildingGeneric;

  return (
    // `transition-colors duration-200` on all three conditionally-colored
    // layers (this outer ring, the inner circle's fill+border, the icon)
    // -- per the user, 2026-09-26: the default<->selected swap was an
    // instant color snap before. 200ms matches `MapPinPopover.tsx`'s own
    // fade-in/out duration, per the user's own "match that transition"
    // ask, so a pin coloring in/out and its popover fading in/out read as
    // one coordinated motion rather than two independently-timed ones.
    // `motion-reduce:transition-none` -- same guard every other
    // transition in this app's Map subtree already carries.
    <div
      className={`flex size-11 items-center justify-center rounded-full transition-colors duration-200 motion-reduce:transition-none ${selected ? 'bg-[#C08E16]/60' : 'bg-[#4B4D4E]/60'}`}
    >
      <div
        className={`flex size-8 items-center justify-center rounded-full border-[1px] border-[#FDE272] transition-colors duration-200 motion-reduce:transition-none ${selected ? 'bg-[#FDE272]' : 'bg-[#323334]'}`}
      >
        <Icon
          aria-hidden="true"
          className={`size-1/2 transition-colors duration-200 motion-reduce:transition-none ${selected ? 'text-[#191A1A]' : 'text-[#FDE272]'}`}
        />
      </div>
    </div>
  );
}
