import type { Movie } from './types';
import MovieCard from './MovieCard';

interface MovieGridProps {
  movies: Movie[];
  favorites?: Set<number>;
  onToggleFavorite?: (movie: Movie) => void;
  emptyMessage?: string;
}

export default function MovieGrid({
  movies,
  favorites = new Set(),
  onToggleFavorite,
  emptyMessage = 'No movies found.',
}: MovieGridProps) {
  if (movies.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isFavorite={favorites.has(movie.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
