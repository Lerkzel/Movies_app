import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Movie } from '../catalog/types';
import { searchMovies } from './api';
import MovieGrid from '../catalog/MovieGrid';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import Pagination from '../../components/Pagination';

interface SearchPageProps {
  favorites: Set<number>;
  onToggleFavorite: (movie: Movie) => void;
}

export default function SearchPage({ favorites, onToggleFavorite }: SearchPageProps) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    if (!query.trim()) return;

    const controller = new AbortController();
    let cancelled = false;

    const doSearch = async () => {
      setLoading(true);
      setError(null);
      setPage(1);
      try {
        const data = await searchMovies(query, 1);
        if (!cancelled) {
          setMovies(data.results);
          setTotalPages(data.total_pages);
          setTotalResults(data.total_results);
          setPage(1);
        }
      } catch {
        if (!cancelled) setError('Search failed. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    doSearch();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [query]);

  const handlePageChange = async (newPage: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchMovies(query, newPage);
      setMovies(data.results);
      setTotalPages(data.total_pages);
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setError('Failed to load page. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!query.trim()) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-semibold text-gray-300 mb-2">Search for Movies</h2>
        <p className="text-gray-500">Use the search bar above to find your favorite films.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">
          Results for: <span className="text-yellow-400">"{query}"</span>
        </h1>
        {!loading && !error && (
          <p className="text-gray-500 text-sm mt-1">
            {totalResults.toLocaleString()} movies found
          </p>
        )}
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} onRetry={() => handlePageChange(page)} />}

      {!loading && !error && movies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-5xl mb-4">🎭</div>
          <p className="text-gray-400 text-lg">No movies found for "{query}"</p>
          <p className="text-gray-600 text-sm mt-2">Try a different search term</p>
        </div>
      )}

      {!loading && !error && movies.length > 0 && (
        <>
          <MovieGrid
            movies={movies}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
          />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
