import type { Location } from '../../data/locations';

export interface MapHandle {
  /** Pans/zooms the map to center on `location` (docs/PLAN.md §2.1's
   * `flyTo`). Callers pass the whole `Location`, not raw coordinates, so
   * this stays the single place that reads `lat`/`lng` off it. */
  flyTo: (location: Location) => void;
  /** Selects (or, with `null`, deselects) a pin -- opens/closes its
   * popover the same way clicking the pin itself does. */
  setSelected: (id: string | null) => void;
}

export interface MapProps {
  locations: Location[];
  selectedLocationId: string | null;
  onPinSelect: (id: string | null) => void;
  className?: string;
}
