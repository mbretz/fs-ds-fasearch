import type { Location } from '../../data/locations';

export interface MapHandle {
  /** Pans/zooms the map to center on `location` (docs/PLAN.md §2.1's
   * `flyTo`). Callers pass the whole `Location`, not raw coordinates, so
   * this stays the single place that reads `lat`/`lng` off it. */
  flyTo: (location: Location) => void;
}

export interface MapProps {
  locations: Location[];
  /** The one "visually selected" pin -- colors it with `MapPin`'s
   * "inverse" treatment and drives `ResultsList`'s own matching row
   * highlight (Dual view), regardless of whether that selection came
   * from clicking the pin itself or the list row. Deliberately NOT what
   * opens the pin's popover -- see `Map.tsx`'s own internal
   * `popoverLocationId` state for that, which only a real pin click (or
   * `onPinSelect`) sets, per the user, 2026-09-25: a Dual-view list row
   * click should highlight its pin to avoid duplicating the same info
   * the popover would show, not also pop it open. */
  selectedLocationId: string | null;
  /** Real pin-click intent -- set by clicking a marker (this stays the
   * single source of truth `Results.tsx`'s own `selectedLocationId`
   * state derives from) and by this component's own popover
   * close/pan-away handling (`null`). `Results.tsx`'s `handleListSelect`
   * (Dual view's list row click) deliberately does NOT call this -- it
   * sets `selectedLocationId` directly instead, precisely so it does
   * NOT open a popover. */
  onPinSelect: (id: string | null) => void;
  /** Forwarded to `getBranchRosterLocation` for a "branch" pin's own
   * `BranchPopoverContent` -- lets its "N Financial Advisors" button and
   * advisor list show the branch's real full roster (after facet
   * filters, ignoring search-match narrowing) instead of whatever
   * narrower `advisors` subset a search match left on the `location`
   * object it's given -- same fix, same reasoning as `ResultsList`'s own
   * identical props, see that function's own doc comment
   * (useFilteredLocations.ts). */
  selectedFocusAreas: string[];
  acceptingNewClientsOnly: boolean;
  className?: string;
}
