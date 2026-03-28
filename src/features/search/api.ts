import tmdbClient from '../../services/tmdbClient';
import type { SearchResponse } from './types';

export const searchMovies = async (query: string, page = 1): Promise<SearchResponse> => {
  const response = await tmdbClient.get<SearchResponse>('/search/movie', {
    params: { query, page, include_adult: false },
  });
  return response.data;
};
