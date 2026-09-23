export const FAVORITES_CAP = 3;

export type ToggleFavoriteResult = 'added' | 'removed' | 'at-cap';

export interface FavoritesContextValue {
  favoriteIds: string[];
  isFavorite: (advisorId: string) => boolean;
  /** Removes an already-favorited id (always succeeds). Otherwise adds it,
   * unless `favoriteIds` is already at `FAVORITES_CAP` -- that case leaves
   * state untouched and returns 'at-cap' so `FavoriteToggle` can surface an
   * inline error instead of silently no-op'ing. */
  toggleFavorite: (advisorId: string) => ToggleFavoriteResult;
}
