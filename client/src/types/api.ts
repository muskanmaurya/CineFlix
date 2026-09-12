export interface ApiErrorBody {
  message: string;
  code?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: PaginationMeta;
  error?: ApiErrorBody;
}

export interface PaginationMeta {
  page: number;
  totalPages: number;
  totalResults: number;
}

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

export interface NormalizedMovieDetails extends NormalizedMovie {
  runtime: number | null;
  tagline: string;
  status: string;
  genres: Array<{ id: number; name: string }>;
  budget: number;
  revenue: number;
  homepage: string | null;
  imdbId: string | null;
  trailers: NormalizedVideo[];
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

export interface WishlistItem {
  id: string;
  visitorId: string;
  movieId: number;
  title: string;
  posterPath: string | null;
  releaseDate: string | null;
  rating: number | null;
  createdAt: string;
  updatedAt: string;
}