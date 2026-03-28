import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import CatalogPage from './features/catalog/CatalogPage';
import SearchPage from './features/search/SearchPage';
import MovieDetailsPage from './features/details/MovieDetailsPage';
import FavoritesPage from './features/favorites/FavoritesPage';
import type { Movie } from './features/catalog/types';
import type { FavoriteMovie } from './features/favorites/types';

const FAVORITES_KEY = 'cinescope_favorites';

function loadFavorites(): FavoriteMovie[] {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function saveFavorites(favs: FavoriteMovie[]): void {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
}

export default function App() {
  const [favorites, setFavorites] = useState<FavoriteMovie[]>(loadFavorites);

  const favoriteIds = new Set(favorites.map((f) => f.id));

  const toggleFavorite = useCallback((movie: Movie) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === movie.id);
      const updated = exists
        ? prev.filter((f) => f.id !== movie.id)
        : [
            ...prev,
            {
              id: movie.id,
              title: movie.title,
              poster_path: movie.poster_path,
              vote_average: movie.vote_average,
              release_date: movie.release_date,
              overview: movie.overview,
            },
          ];
      saveFavorites(updated);
      return updated;
    });
  }, []);

  const removeFavorite = useCallback((id: number) => {
    setFavorites((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      saveFavorites(updated);
      return updated;
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route
            index
            element={
              <CatalogPage
                mode="trending"
                favorites={favoriteIds}
                onToggleFavorite={toggleFavorite}
              />
            }
          />
          <Route
            path="popular"
            element={
              <CatalogPage
                mode="popular"
                favorites={favoriteIds}
                onToggleFavorite={toggleFavorite}
              />
            }
          />
          <Route
            path="top-rated"
            element={
              <CatalogPage
                mode="top_rated"
                favorites={favoriteIds}
                onToggleFavorite={toggleFavorite}
              />
            }
          />
          <Route
            path="upcoming"
            element={
              <CatalogPage
                mode="upcoming"
                favorites={favoriteIds}
                onToggleFavorite={toggleFavorite}
              />
            }
          />
          <Route
            path="search"
            element={
              <SearchPage
                favorites={favoriteIds}
                onToggleFavorite={toggleFavorite}
              />
            }
          />
          <Route
            path="movie/:id"
            element={
              <MovieDetailsPage
                favorites={favoriteIds}
                onToggleFavorite={toggleFavorite}
              />
            }
          />
          <Route
            path="favorites"
            element={
              <FavoritesPage
                favorites={favorites}
                onRemove={removeFavorite}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
