import { Link } from 'react-router-dom';
import type { Movie } from './types';
import { getPosterUrl } from '../../services/tmdbClient';

interface MovieCardProps {
  movie: Movie;
  isFavorite?: boolean;
  onToggleFavorite?: (movie: Movie) => void;
}

export default function MovieCard({ movie, isFavorite = false, onToggleFavorite }: MovieCardProps) {
  const year = movie.release_date ? movie.release_date.slice(0, 4) : 'N/A';
  const rating = movie.vote_average.toFixed(1);
  const ratingColor =
    movie.vote_average >= 7
      ? 'text-green-400'
      : movie.vote_average >= 5
      ? 'text-yellow-400'
      : 'text-red-400';

  return (
    <div className="group relative bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-yellow-400/10 hover:-translate-y-1 transition-all duration-200">
      <Link to={`/movie/${movie.id}`}>
        <div className="relative aspect-[2/3] overflow-hidden bg-gray-800">
          {movie.poster_path ? (
            <img
              src={getPosterUrl(movie.poster_path, 'w300')}
              alt={movie.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">
              No Image
            </div>
          )}

          {/* Rating badge */}
          <div className={`absolute top-2 left-2 px-2 py-1 bg-black/80 rounded-md text-xs font-bold ${ratingColor}`}>
            ★ {rating}
          </div>
        </div>

        <div className="p-3">
          <h3 className="text-sm font-semibold text-white truncate group-hover:text-yellow-400 transition-colors">
            {movie.title}
          </h3>
          <p className="text-xs text-gray-500 mt-1">{year}</p>
        </div>
      </Link>

      {onToggleFavorite && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite(movie);
          }}
          className={`absolute top-2 right-2 p-1.5 rounded-full bg-black/70 transition-colors ${
            isFavorite ? 'text-yellow-400 hover:text-yellow-300' : 'text-gray-400 hover:text-yellow-400'
          }`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      )}
    </div>
  );
}
