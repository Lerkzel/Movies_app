import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';

const tmdbClient = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
    language: 'en-US',
  },
});

export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const getPosterUrl = (path: string | null, size: 'w200' | 'w300' | 'w500' | 'original' = 'w500'): string => {
  if (!path) return '/no-poster.png';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (path: string | null, size: 'w780' | 'w1280' | 'original' = 'w1280'): string => {
  if (!path) return '';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export default tmdbClient;
