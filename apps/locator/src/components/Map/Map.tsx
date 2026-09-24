import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Location } from '../../data/locations';
import { MapPin } from './MapPin';
import { MapLegend } from './MapLegend';
import { MapPinPopover } from './MapPinPopover';
import { AdvisorPopoverContent } from './AdvisorPopoverContent';
import { BranchPopoverContent } from './BranchPopoverContent';
import { getPinType } from './pinType';
import { cn } from '../../utils/cn';
import type { MapHandle, MapProps } from './Map.types';

// Free OSM raster tiles, no API key -- docs/PLAN.md §2.1's locked choice
// (with a noted, not-yet-implemented upgrade path to MapTiler vector
// tiles). The `&copy;` attribution is a legal requirement of this tile
// source, not optional styling -- see the `AttributionControl` below.
const OSM_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap contributors',
    },
  },
  layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
};

const DEFAULT_ZOOM = 10;
// Popover content picks its Large/Small variant off the map's own
// rendered width, per the user -- full-width desktop Map view (~1214px)
// gets Large, a ~half-width Dual view pane (~600px) or mobile (~350-
// 390px) gets Small. A CSS container query can't do this: the popover
// portals to `document.body` (Radix's `Popover.Portal`), outside this
// component's DOM subtree entirely, so `ResizeObserver` + JS state is
// the real fallback here, not a stopgap.
const POPOVER_LARGE_MIN_WIDTH = 700;
// The full mock dataset's own lat/lng centroid (`data/locations.ts`'s 20
// locations) -- used when there are no results to center on at all, per
// the user: west of any single location (e.g. `loc-1`'s own St. Louis
// Downtown coordinates, this constant's previous value), matching where
// `getCenter` below actually lands once real locations are averaged.
const FALLBACK_CENTER: [number, number] = [-90.4306, 38.6498];

// Centers on the average position of whatever locations are actually
// showing, not just the first one in the (filtered) array -- per the
// user, that skewed the initial view east of this dataset's own real
// geographic spread rather than centering it.
function getCenter(locations: Location[]): [number, number] {
  if (locations.length === 0) return FALLBACK_CENTER;
  const total = locations.reduce(
    (acc, location) => ({
      lat: acc.lat + location.lat,
      lng: acc.lng + location.lng,
    }),
    { lat: 0, lng: 0 },
  );
  return [total.lng / locations.length, total.lat / locations.length];
}

// Thin wrapper around raw `maplibre-gl` (the only map library installed --
// no React wrapper) per docs/PLAN.md §2.1: keeps MapLibre itself out of
// the rest of the app, exposing only `flyTo`/`setSelected` via
// `useImperativeHandle`. Markers are plain MapLibre `Marker`s backed by
// an empty div; the actual pin JSX renders into that div via
// `createPortal`, so pins stay real React (reusing DS `Avatar` and
// `statusMeta` tokens) while MapLibre owns positioning.
//
// The open popover closes on a user-initiated pan (`movestart`) rather
// than continuously re-tracking a moving virtual anchor mid-drag/flyTo --
// simpler, and it reopens cleanly once the pan/flyTo settles instead
// (`setSelected`/a pin click both call `onPinSelect` again after the
// map's already at rest).
export const Map = forwardRef<MapHandle, MapProps>(function Map(
  { locations, selectedLocationId, onPinSelect, className },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [ready, setReady] = useState(false);
  const [markerEls, setMarkerEls] = useState<Record<string, HTMLDivElement>>(
    {},
  );
  const [popoverSize, setPopoverSize] = useState<'sm' | 'lg'>('lg');

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setPopoverSize(
        (entry?.contentRect.width ?? 0) >= POPOVER_LARGE_MIN_WIDTH
          ? 'lg'
          : 'sm',
      );
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: OSM_STYLE,
      center: getCenter(locations),
      zoom: DEFAULT_ZOOM,
    });
    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.addControl(new maplibregl.AttributionControl({ compact: true }));
    map.on('movestart', (event) => {
      // `event.originalEvent` is only set for user-initiated moves (drag/
      // scroll/touch), not for a programmatic `flyTo` -- deselecting on
      // those too would immediately close the popover `setSelected` just
      // opened.
      if (event.originalEvent) onPinSelect(null);
    });
    map.on('load', () => setReady(true));
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
    // Intentionally run once -- `locations`/`onPinSelect` changing
    // shouldn't tear down and recreate the whole MapLibre instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      flyTo(location) {
        mapRef.current?.flyTo({
          center: [location.lng, location.lat],
          zoom: DEFAULT_ZOOM,
        });
      },
      setSelected(id) {
        onPinSelect(id);
      },
    }),
    [onPinSelect],
  );

  // One MapLibre Marker per location, created imperatively once the map
  // has loaded -- `markerEls` (state, not a plain ref) is what triggers
  // the portal-rendering pass below once they exist.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const markers: maplibregl.Marker[] = [];
    const els: Record<string, HTMLDivElement> = {};
    for (const location of locations) {
      const el = document.createElement('div');
      // Sized up front, before `addTo()` -- MapLibre reads the marker
      // element's own rendered size once, synchronously, to compute its
      // center-anchor offset. Our actual pin content (`MapPin`, via
      // `createPortal` below) only paints in *after* this synchronous
      // pass (React's next commit), so without this the marker briefly
      // measures 0x0 and anchors from its own top-left corner instead of
      // its center -- matches `MapPin`'s own 44px (`size-11`) box.
      el.style.width = '44px';
      el.style.height = '44px';
      el.style.cursor = 'pointer';
      el.addEventListener('click', (event) => {
        event.stopPropagation();
        onPinSelect(location.id);
      });
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([location.lng, location.lat])
        .addTo(map);
      els[location.id] = el;
      markers.push(marker);
    }
    setMarkerEls(els);
    return () => {
      markers.forEach((marker) => marker.remove());
      setMarkerEls({});
    };
  }, [locations, ready, onPinSelect]);

  const selectedLocation =
    locations.find((location) => location.id === selectedLocationId) ?? null;

  const getAnchorRect = useCallback((): DOMRect => {
    const el = selectedLocationId ? markerEls[selectedLocationId] : undefined;
    return el?.getBoundingClientRect() ?? new DOMRect();
  }, [selectedLocationId, markerEls]);

  return (
    <div
      ref={wrapperRef}
      className={cn(
        // 8px mobile (`generous`), 24px desktop (`large`) -- matches
        // Figma's own `Map Component Mobile`/`Map Component Large`
        // radii exactly, not one shared value at every breakpoint.
        // Border color is `primitives.ref.color.neutral-600` -- no
        // semantic/component-tier alias resolves to this value (checked
        // against packages/tokens/build/css/tokens.css), so this is a
        // primitives reference directly, per the user; it also matches
        // Figma's own `#979A9B` stroke on both Map Component instances
        // exactly.
        'relative overflow-hidden rounded-[var(--semantic-border-radius-generous)] border-[length:1px] border-[color:var(--primitives-ref-color-neutral-600)] shadow-[inset_0px_1px_1px_0px_rgba(13,13,13,0.8)] md:rounded-[var(--semantic-border-radius-large)]',
        className,
      )}
    >
      {/* Shrunk down from Figma's own measured heights (497px mobile/
          751px desktop -- see `Map Component Mobile`/`Map Component
          Large`), then nudged back up ~100px from that first pass and
          rounded to the nearest multiple of 4, per the user -- keep
          `Results.tsx`'s `MOBILE_MAP_HEIGHT`/`DESKTOP_MAP_HEIGHT` in
          sync if this changes again. */}
      <div ref={containerRef} className="h-[432px] w-full md:h-[600px]" />
      <MapLegend />
      {Object.entries(markerEls).map(([id, el]) => {
        const location = locations.find((l) => l.id === id);
        if (!location) return null;
        return createPortal(<MapPin location={location} />, el, id);
      })}
      {selectedLocation && (
        // `key={selectedLocationId}` -- Radix Popper positions a
        // `virtualRef` anchor once per mount; it has no real DOM node to
        // watch for the auto-reposition-on-change floating-ui otherwise
        // sets up, so clicking a *different* pin while a popover is
        // already open (`open` never actually toggles false->true) left
        // the old popover in its old position with the new pin's content
        // swapped into it, per the user. Keying by id forces a full
        // unmount/remount on every pin change, which re-runs Popper's
        // positioning against the new pin from scratch.
        <MapPinPopover
          key={selectedLocationId}
          open={Boolean(selectedLocationId)}
          onOpenChange={(open) => {
            if (!open) onPinSelect(null);
          }}
          getAnchorRect={getAnchorRect}
        >
          {getPinType(selectedLocation) === 'branch' ? (
            <BranchPopoverContent
              location={selectedLocation}
              size={popoverSize}
            />
          ) : (
            selectedLocation.advisors[0] && (
              <AdvisorPopoverContent
                advisor={selectedLocation.advisors[0]}
                size={popoverSize}
              />
            )
          )}
        </MapPinPopover>
      )}
    </div>
  );
});
