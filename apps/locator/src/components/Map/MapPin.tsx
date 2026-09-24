import { Avatar as AvatarIcon, BuildingGeneric } from 'icons';
import type { Location } from '../../data/locations';
import { getPinType } from './pinType';

export interface MapPinProps {
  location: Location;
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
export function MapPin({ location }: MapPinProps) {
  const type = getPinType(location);
  const Icon = type === 'single' ? AvatarIcon : BuildingGeneric;

  return (
    <div className="flex size-11 items-center justify-center rounded-full bg-[#4B4D4E]/60">
      <div className="flex size-8 items-center justify-center rounded-full border-[1px] border-[#FDE272] bg-[#323334]">
        <Icon aria-hidden="true" className="size-1/2 text-[#FDE272]" />
      </div>
    </div>
  );
}
