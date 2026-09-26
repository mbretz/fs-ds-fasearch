// Great-circle distance between two lat/lng points, in miles -- the
// standard haversine formula, no external geocoding/distance service.
// Reconstructed per docs/PLAN.md's own "Near Me" note (2026-09-20): this
// is the only real-math piece of that feature (the rest is a fixed fake
// user location -- see useFilteredLocations.ts's own `FAKE_USER_LOCATION`
// -- and a plain `.sort()`), kept in its own file since it's a pure,
// independently-testable function with no dependency on this app's data
// shapes.
const EARTH_RADIUS_MILES = 3958.8;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function haversineDistanceMiles(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const deltaLat = toRadians(lat2 - lat1);
  const deltaLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(deltaLng / 2) ** 2;
  return EARTH_RADIUS_MILES * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
