/**
 * Raw TMDB API DTOs (Data Transfer Objects)
 */

export interface TmdbMovieDto {
  id: number;
  title: string;
  original_title?: string;
  overview: string | null;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  popularity?: number;
  adult?: boolean;
  video?: boolean;
}

export interface TmdbPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TmdbGenreDto {
  id: number;
  name: string;
}

export interface TmdbGenresResponse {
  genres: TmdbGenreDto[];
}

export interface TmdbProductionCompanyDto {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface TmdbMovieDetailsDto extends Omit<TmdbMovieDto, 'genre_ids'> {
  genres: TmdbGenreDto[];
  budget: number;
  revenue: number;
  runtime: number | null;
  tagline: string | null;
  status: string;
  homepage: string | null;
  imdb_id: string | null;
  production_companies?: TmdbProductionCompanyDto[];
  videos?: TmdbVideosResponse;
}

export interface TmdbVideoDto {
  id: string;
  iso_639_1?: string;
  iso_3166_1?: string;
  name: string;
  key: string;
  site: string;
  size?: number;
  type: string;
  official?: boolean;
  published_at?: string;
}

export interface TmdbVideosResponse {
  id: number;
  results: TmdbVideoDto[];
}

/**
 * Normalized Internal Application Models
 */

export interface NormalizedMovie {
  id: number;
  title: string;
  overview: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseDate: string;
  rating: number;
  voteCount: number;
  genreIds: number[];
}

export interface NormalizedGenre {
  id: number;
  name: string;
}

export interface NormalizedVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  isTrailer: boolean;
  embedUrl: string | null;
}

export interface NormalizedMovieDetails extends NormalizedMovie {
  runtime: number | null;
  tagline: string;
  status: string;
  genres: NormalizedGenre[];
  budget: number;
  revenue: number;
  homepage: string | null;
  imdbId: string | null;
  trailers: NormalizedVideo[];
}

export interface NormalizedPaginatedResponse<T> {
  page: number;
  totalPages: number;
  totalResults: number;
  results: T[];
}
