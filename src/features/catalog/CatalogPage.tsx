import { useState, useEffect, useCallback } from 'react';
import type { Movie } from './types';
import { fetchTrending, fetchPopular, fetchTopRated, fetchUpcoming } from './api';
import MovieGrid from './MovieGrid';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import Pagination from '../../components/Pagination';

type CatalogMode = 'trending' | 'popular' | 'top_rated' | 'upcoming';

interface CatalogPageProps {
  mode: CatalogMode;
  favorites: Set<number>;
  onToggleFavorite: (movie: Movie) => void;
}

const titles: Record<CatalogMode, string> = {
  trending: '🔥 Trending This Week',
  popular: '🎯 Popular Movies',
  top_rated: '⭐ Top Rated',
  upcoming: '🎬 Upcoming',
};

const fetchers: Record<CatalogMode, (page: number) => Promise<{ results: Movie[]; total_pages: number }>> = {
  trending: fetchTrending,
  popular: fetchPopular,
  top_rated: fetchTopRated,
  upcoming: fetchUpcoming,
};

export default function CatalogPage({ mode, favorites, onToggleFavorite }: CatalogPageProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchers[mode](p);
      setMovies(data.results);
      setTotalPages(data.total_pages);
    } catch {
      setError('Failed to load movies. Check your API key or try again.');
    } finally {
      setLoading(false);
    }
  }, [mode]);

  useEffect(() => {
    setPage(1);
    load(1);
  }, [mode]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    load(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">{titles[mode]}</h1>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} onRetry={() => load(page)} />}

      {!loading && !error && (
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
