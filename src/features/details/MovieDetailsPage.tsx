import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMovieDetails, fetchMovieCredits, fetchMovieVideos, fetchSimilarMovies } from './api';
import type { MovieDetails, Credits, VideoResult } from './types';
import type { Movie } from '../catalog/types';
import { getPosterUrl, getBackdropUrl } from '../../services/tmdbClient';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import MovieGrid from '../catalog/MovieGrid';

interface MovieDetailsPageProps {
  favorites: Set<number>;
  onToggleFavorite: (movie: Movie) => void;
}

export default function MovieDetailsPage({ favorites, onToggleFavorite }: MovieDetailsPageProps) {
  const { id } = useParams<{ id: string }>();
  const movieId = Number(id);

  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [trailer, setTrailer] = useState<VideoResult | null>(null);
  const [similar, setSimilar] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!movieId) return;

    const load = async () => {
      setLoading(true);
      setError(null);
      setDetails(null);
      try {
        const [det, cred, vids, sim] = await Promise.all([
          fetchMovieDetails(movieId),
          fetchMovieCredits(movieId),
          fetchMovieVideos(movieId),
          fetchSimilarMovies(movieId),
        ]);
        setDetails(det);
        setCredits(cred);
        const officialTrailer = vids.results.find(
          (v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official
        ) ?? vids.results.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ?? null;
        setTrailer(officialTrailer);
        setSimilar(sim.results.slice(0, 12));
      } catch {
        setError('Failed to load movie details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [movieId]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (error || !details) return <ErrorMessage message={error ?? 'Movie not found.'} />;

  const isFav = favorites.has(details.id);
  const director = credits?.crew.find((c) => c.job === 'Director');
  const topCast = credits?.cast.slice(0, 8) ?? [];
  const ratingColor =
    details.vote_average >= 7 ? 'text-green-400' : details.vote_average >= 5 ? 'text-yellow-400' : 'text-red-400';

  const fakeMovie: Movie = {
    id: details.id,
    title: details.title,
    overview: details.overview,
    poster_path: details.poster_path,
    backdrop_path: details.backdrop_path,
    release_date: details.release_date,
    vote_average: details.vote_average,
    vote_count: details.vote_count,
    genre_ids: details.genres.map((g) => g.id),
    popularity: details.popularity,
    original_language: details.original_language,
    adult: details.adult,
  };

  return (
    <div>
      {/* Backdrop */}
      {details.backdrop_path && (
        <div className="relative -mx-4 -mt-6 h-64 sm:h-80 md:h-96 overflow-hidden mb-8">
          <img
            src={getBackdropUrl(details.backdrop_path)}
            alt={details.title}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Poster */}
        <div className="shrink-0 mx-auto md:mx-0">
          <img
            src={getPosterUrl(details.poster_path, 'w300')}
            alt={details.title}
            className="w-48 md:w-56 rounded-xl shadow-2xl"
          />
          <button
            onClick={() => onToggleFavorite(fakeMovie)}
            className={`mt-3 w-full py-2 rounded-lg font-semibold text-sm transition-colors ${
              isFav
                ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {isFav ? '★ In Favorites' : '☆ Add to Favorites'}
          </button>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">{details.title}</h1>
            <span className={`mt-1 text-xl font-bold ${ratingColor}`}>★ {details.vote_average.toFixed(1)}</span>
          </div>

          {details.tagline && (
            <p className="text-gray-400 italic mb-4">"{details.tagline}"</p>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            {details.genres.map((g) => (
              <span key={g.id} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs font-medium">
                {g.name}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm mb-5">
            <div>
              <span className="text-gray-500 block text-xs uppercase tracking-wider">Release</span>
              <span className="text-gray-200">{details.release_date || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-xs uppercase tracking-wider">Runtime</span>
              <span className="text-gray-200">{details.runtime ? `${details.runtime} min` : 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-xs uppercase tracking-wider">Language</span>
              <span className="text-gray-200 uppercase">{details.original_language}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-xs uppercase tracking-wider">Votes</span>
              <span className="text-gray-200">{details.vote_count.toLocaleString()}</span>
            </div>
            {director && (
              <div>
                <span className="text-gray-500 block text-xs uppercase tracking-wider">Director</span>
                <span className="text-gray-200">{director.name}</span>
              </div>
            )}
            <div>
              <span className="text-gray-500 block text-xs uppercase tracking-wider">Status</span>
              <span className="text-gray-200">{details.status}</span>
            </div>
          </div>

          <h2 className="text-lg font-semibold text-white mb-2">Overview</h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            {details.overview || 'No overview available.'}
          </p>

          {trailer && (
            <a
              href={`https://www.youtube.com/watch?v=${trailer.key}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 transition-colors"
            >
              ▶ Watch Trailer
            </a>
          )}
        </div>
      </div>

      {/* Cast */}
      {topCast.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-white mb-4">Cast</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {topCast.map((member) => (
              <div key={member.id} className="shrink-0 w-24 text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-800 mx-auto mb-2">
                  {member.profile_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w185${member.profile_path}`}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-2xl">👤</div>
                  )}
                </div>
                <p className="text-xs font-semibold text-gray-200 truncate">{member.name}</p>
                <p className="text-xs text-gray-500 truncate">{member.character}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Similar Movies */}
      {similar.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-white mb-4">Similar Movies</h2>
          <MovieGrid
            movies={similar}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
          />
        </section>
      )}
    </div>
  );
}
