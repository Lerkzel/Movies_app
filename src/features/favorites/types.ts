import type { Movie } from '../catalog/types';

export type FavoriteMovie = Pick<Movie, 'id' | 'title' | 'poster_path' | 'vote_average' | 'release_date' | 'overview'>;

export interface FavoritesState {
  favorites: FavoriteMovie[];
  isFavorite: (id: number) => boolean;
  addFavorite: (movie: FavoriteMovie) => void;
  removeFavorite: (id: number) => void;
}
