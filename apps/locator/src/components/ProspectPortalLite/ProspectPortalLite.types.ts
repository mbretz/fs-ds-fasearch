export interface ProspectPortalLiteProps {
  /**
   * This page's own display name (e.g. the advisor's full name, or the
   * location's `name`) -- carried on the "View favorites." link's own
   * `?from=` query param so `/favorites`'s mobile "Back to [X]" link
   * (added 2026-09-23) can label itself correctly. A full-page `<a href>`
   * navigation (same as every other internal link in this app -- no
   * client-side router `Link`/`state` in use) can't rely on in-memory
   * router state to survive the round trip, so this rides in the URL
   * instead.
   */
  favoritesFromLabel: string;
  className?: string;
}
