import { TMDB_CONSTANTS } from './tmdb.constants';
import {
  NormalizedGenre,
  NormalizedMovie,
  NormalizedMovieDetails,
  NormalizedPaginatedResponse,
  NormalizedVideo,
  TmdbGenreDto,
  TmdbMovieDetailsDto,
  TmdbMovieDto,
  TmdbPaginatedResponse,
  TmdbVideoDto,
} from './tmdb.types';

/**
 * Builds full image URL or returns null if path is missing
 */
export const buildTmdbImageUrl = (
  path: string | null | undefined,
  size: string = TMDB_CONSTANTS.POSTER_SIZE
): string | null => {
  if (!path) return null;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${TMDB_CONSTANTS.IMAGE_BASE_URL}/${size}${cleanPath}`;
};

/**
 * Maps raw TMDB Genre DTO to NormalizedGenre
 */
export const mapTmdbGenreToNormalized = (dto: TmdbGenreDto): NormalizedGenre => ({
  id: dto.id,
  name: dto.name || 'Unknown',
});

/**
 * Maps raw TMDB Video DTO to NormalizedVideo
 */
export const mapTmdbVideoToNormalized = (dto: TmdbVideoDto): NormalizedVideo => {
  const isYouTube = dto.site?.toLowerCase() === 'youtube';
  const isTrailer = dto.type?.toLowerCase() === 'trailer' && isYouTube;

  return {
    id: dto.id,
    key: dto.key,
    name: dto.name || 'Video Trailer',
    site: dto.site || 'YouTube',
    type: dto.type || 'Trailer',
    isTrailer,
    embedUrl: isYouTube && dto.key ? `https://www.youtube.com/embed/${dto.key}` : null,
  };
};

/**
 * Maps raw TMDB Movie DTO to NormalizedMovie
 */
export const mapTmdbMovieToNormalized = (dto: TmdbMovieDto): NormalizedMovie => {
  const rating = typeof dto.vote_average === 'number' ? Math.round(dto.vote_average * 10) / 10 : 0;

  return {
    id: dto.id,
    title: dto.title || dto.original_title || 'Untitled',
    overview: dto.overview || 'No overview available.',
    posterUrl: buildTmdbImageUrl(dto.poster_path, TMDB_CONSTANTS.POSTER_SIZE),
    backdropUrl: buildTmdbImageUrl(dto.backdrop_path, TMDB_CONSTANTS.BACKDROP_SIZE),
    releaseDate: dto.release_date || '',
    rating,
    voteCount: dto.vote_count || 0,
    genreIds: Array.isArray(dto.genre_ids) ? dto.genre_ids : [],
  };
};

/**
 * Maps raw TMDB Movie Details DTO to NormalizedMovieDetails
 */
export const mapTmdbMovieDetailsToNormalized = (
  dto: TmdbMovieDetailsDto
): NormalizedMovieDetails => {
  const baseMovie = mapTmdbMovieToNormalized(dto);
  const rawGenres = Array.isArray(dto.genres) ? dto.genres : [];
  const rawVideos = Array.isArray(dto.videos?.results) ? dto.videos!.results : [];

  return {
    ...baseMovie,
    runtime: typeof dto.runtime === 'number' ? dto.runtime : null,
    tagline: dto.tagline || '',
    status: dto.status || 'Released',
    genres: rawGenres.map(mapTmdbGenreToNormalized),
    budget: dto.budget || 0,
    revenue: dto.revenue || 0,
    homepage: dto.homepage || null,
    imdbId: dto.imdb_id || null,
    trailers: rawVideos.map(mapTmdbVideoToNormalized).filter((video) => video.isTrailer),
  };
};

/**
 * Generic mapper for paginated TMDB lists
 */
export const mapTmdbPaginatedResponseToNormalized = <T, U>(
  response: TmdbPaginatedResponse<T>,
  itemMapper: (item: T) => U
): NormalizedPaginatedResponse<U> => ({
  page: response.page || 1,
  totalPages: response.total_pages || 1,
  totalResults: response.total_results || 0,
  results: Array.isArray(response.results) ? response.results.map(itemMapper) : [],
});
