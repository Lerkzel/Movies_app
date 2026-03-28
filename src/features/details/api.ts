import tmdbClient from '../../services/tmdbClient';
import type { MovieDetails, Credits, VideosResponse } from './types';
import type { Movie } from '../catalog/types';

export const fetchMovieDetails = async (movieId: number): Promise<MovieDetails> => {
  const response = await tmdbClient.get<MovieDetails>(`/movie/${movieId}`);
  return response.data;
};

export const fetchMovieCredits = async (movieId: number): Promise<Credits> => {
  const response = await tmdbClient.get<Credits>(`/movie/${movieId}/credits`);
  return response.data;
};

export const fetchMovieVideos = async (movieId: number): Promise<VideosResponse> => {
  const response = await tmdbClient.get<VideosResponse>(`/movie/${movieId}/videos`);
  return response.data;
};

export const fetchSimilarMovies = async (movieId: number): Promise<{ results: Movie[] }> => {
  const response = await tmdbClient.get<{ results: Movie[] }>(`/movie/${movieId}/similar`);
  return response.data;
};
