import type { ApiResponse, NormalizedMovie, NormalizedMovieDetails, PaginationMeta } from './api';

export interface HomeMovies {
  trending: NormalizedMovie[];
  popular: NormalizedMovie[];
  topRated: NormalizedMovie[];
  upcoming: NormalizedMovie[];
}

export interface MovieListResult {
  movies: NormalizedMovie[];
  pagination: PaginationMeta;
}

export type MovieDetailsResponse = ApiResponse<NormalizedMovieDetails>;