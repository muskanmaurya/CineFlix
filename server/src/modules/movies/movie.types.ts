import {
  NormalizedMovie,
  NormalizedMovieDetails,
} from '../../integrations/tmdb';

export interface PaginationMeta {
  page: number;
  totalPages: number;
  totalResults: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: PaginationMeta;
  error?: {
    message: string;
    code: string;
  };
}

export interface HomeScreenData {
  trending: NormalizedMovie[];
  popular: NormalizedMovie[];
  topRated: NormalizedMovie[];
  upcoming: NormalizedMovie[];
}

export interface SearchQueryParams {
  q: string;
  page?: number;
}

export interface DiscoverQueryParams {
  page?: number;
  genre?: string | number;
  sort?: string;
  year?: number;
}
