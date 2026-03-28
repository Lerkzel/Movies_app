import { Link } from 'react-router-dom';
import type { FavoriteMovie } from './types';
import { getPosterUrl } from '../../services/tmdbClient';

interface FavoritesPageProps {
  favorites: FavoriteMovie[];
  onRemove: (id: number) => void;
}

export default function FavoritesPage({ favorites, onRemove }: FavoritesPageProps) {
  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-6xl mb-4">⭐</div>
        <h2 className="text-2xl font-semibold text-gray-300 mb-2">No Favorites Yet</h2>
        <p className="text-gray-500 mb-6">Start adding movies to your favorites list!</p>
        <Link
          to="/"
          className="px-6 py-2.5 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-colors"
        >
          Browse Movies
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">
          ⭐ My Favorites{' '}
          <span className="text-gray-500 text-lg font-normal">({favorites.length})</span>
        </h1>
        <button
          onClick={() => {
            if (window.confirm('Remove all favorites?')) {
              favorites.forEach((f) => onRemove(f.id));
            }
          }}
          className="text-sm text-gray-500 hover:text-red-400 transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map((movie) => (
          <div key={movie.id} className="flex gap-4 bg-gray-900 rounded-xl p-4 hover:bg-gray-800 transition-colors">
            <Link to={`/movie/${movie.id}`} className="shrink-0">
              <img
                src={getPosterUrl(movie.poster_path, 'w200')}
                alt={movie.title}
                className="w-16 h-24 object-cover rounded-lg"
              />
            </Link>
            <div className="flex-1 min-w-0">
              <Link to={`/movie/${movie.id}`}>
                <h3 className="font-semibold text-white hover:text-yellow-400 transition-colors truncate">
                  {movie.title}
                </h3>
              </Link>
              <p className="text-xs text-gray-500 mt-0.5">{movie.release_date?.slice(0, 4) ?? 'N/A'}</p>
              <p className="text-yellow-400 text-sm mt-1">★ {movie.vote_average.toFixed(1)}</p>
              <p className="text-gray-500 text-xs mt-2 line-clamp-2">{movie.overview}</p>
            </div>
            <button
              onClick={() => onRemove(movie.id)}
              className="text-gray-600 hover:text-red-400 transition-colors self-start text-lg leading-none"
              aria-label="Remove from favorites"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
