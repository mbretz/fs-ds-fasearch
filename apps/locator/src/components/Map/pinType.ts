import type { Location } from '../../data/locations';

export type PinType = 'single' | 'multiple' | 'branch';

// Figma's Map Pin component set (447:2009) has 3 variants: Single (one
// advisor's own photo) for a one-advisor location; Branch (a generic
// office icon, no avatar) for a multi-advisor location, per the user; and
// Multiple (an avatar + headcount) -- reserved for a *zoomed-out
// clustering* case (visually overlapping Single/Branch pins collapsing
// into one, forking back apart on click), which this Map doesn't
// implement (MapLibre clustering needs a GeoJSON source + real
// screen-space overlap detection, not the plain per-location DOM
// `Marker`s this component uses) -- disregarded per the user, rather than
// built out. `getPinType` below never returns `'multiple'` as a result;
// the type stays 3-way only so `MapPin.tsx` doesn't need to change if
// clustering is ever added later.
//
// A zero-advisor location (support-staff-only branch) also gets Branch --
// same "no one specific advisor to feature" reasoning the user's own
// Branch/multi-advisor case rests on, not confirmed against Figma either
// way.
export function getPinType(location: Location): PinType {
  return location.advisors.length === 1 ? 'single' : 'branch';
}
