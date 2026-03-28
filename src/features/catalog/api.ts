import tmdbClient from '../../services/tmdbClient';
import type { MoviesResponse, GenresResponse } from './types';

export const fetchTrending = async (page = 1): Promise<MoviesResponse> => {
  const response = await tmdbClient.get<MoviesResponse>('/trending/movie/week', {
    params: { page },
  });
  return response.data;
};

export const fetchPopular = async (page = 1): Promise<MoviesResponse> => {
  const response = await tmdbClient.get<MoviesResponse>('/movie/popular', {
    params: { page },
  });
  return response.data;
};

export const fetchTopRated = async (page = 1): Promise<MoviesResponse> => {
  const response = await tmdbClient.get<MoviesResponse>('/movie/top_rated', {
    params: { page },
  });
  return response.data;
};

export const fetchUpcoming = async (page = 1): Promise<MoviesResponse> => {
  const response = await tmdbClient.get<MoviesResponse>('/movie/upcoming', {
    params: { page },
  });
  return response.data;
};

export const fetchGenres = async (): Promise<GenresResponse> => {
  const response = await tmdbClient.get<GenresResponse>('/genre/movie/list');
  return response.data;
};
