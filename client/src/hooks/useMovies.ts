import { useQuery } from '@tanstack/react-query';
import { apiRequest, apiRequestWithMeta } from '../lib/api';
import type { NormalizedMovie, NormalizedMovieDetails } from '../types/api';
import type { HomeMovies, MovieListResult } from '../types/movies';

export function useHomeMovies() {
  return useQuery({
    queryKey: ['homeMovies'],
    queryFn: ({ signal }) => apiRequest<HomeMovies>('/movies/home', { signal }),
    staleTime: 5 * 60 * 1000,
  });
}

export function useMovieSearch(query: string, page: number) {
  return useQuery({
    queryKey: ['movieSearch', query, page],
    queryFn: async ({ signal }): Promise<MovieListResult> => {
      const response = await apiRequestWithMeta<NormalizedMovie[]>(
        `/movies/search?q=${encodeURIComponent(query)}&page=${page}`,
        { signal }
      );
      return {
        movies: response.data,
        pagination: response.pagination ?? { page, totalPages: page, totalResults: response.data.length },
      };
    },
    enabled: query.trim().length > 0,
    staleTime: 2 * 60 * 1000,
  });
}

export function useDiscoverMovies(genre: string, sort: string, page: number, enabled = true) {
  const params = new URLSearchParams({ page: String(page), sort });
  if (genre) params.set('genre', genre);

  return useQuery({
    queryKey: ['discoverMovies', genre, sort, page],
    queryFn: async ({ signal }): Promise<MovieListResult> => {
      const response = await apiRequestWithMeta<NormalizedMovie[]>(
        `/movies/discover?${params.toString()}`,
        { signal }
      );
      return {
        movies: response.data,
        pagination: response.pagination ?? { page, totalPages: page, totalResults: response.data.length },
      };
    },
    enabled,
    staleTime: 2 * 60 * 1000,
  });
}

export function useMovieDetails(movieId: string | undefined) {
  return useQuery({
    queryKey: ['movieDetails', movieId],
    queryFn: ({ signal }) => apiRequest<NormalizedMovieDetails>(`/movies/${movieId}`, { signal }),
    enabled: Boolean(movieId),
    staleTime: 10 * 60 * 1000,
  });
}