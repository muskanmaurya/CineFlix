import {
  mapTmdbMovieDetailsToNormalized,
  mapTmdbMovieToNormalized,
  mapTmdbPaginatedResponseToNormalized,
  NormalizedMovieDetails,
  NormalizedPaginatedResponse,
  tmdbClient,
  TmdbMovieDetailsDto,
  TmdbMovieDto,
  TmdbPaginatedResponse,
} from '../../integrations/tmdb';
import { memoryCache } from '../../utils/cache';
import { DiscoverQueryParams, HomeScreenData } from './movie.types';

export class MovieService {
  /**
   * Fetch home screen curated categories (Trending, Popular, Top Rated, Upcoming)
   */
  public async getHomeScreen(): Promise<HomeScreenData> {
    const cacheKey = 'movies:home';
    const cached = memoryCache.get<HomeScreenData>(cacheKey);
    if (cached) {
      return cached;
    }

    const trendingRes = await tmdbClient.get<TmdbPaginatedResponse<TmdbMovieDto>>('trending/movie/day');
    const popularRes = await tmdbClient.get<TmdbPaginatedResponse<TmdbMovieDto>>('movie/popular');
    const topRatedRes = await tmdbClient.get<TmdbPaginatedResponse<TmdbMovieDto>>('movie/top_rated');
    const upcomingRes = await tmdbClient.get<TmdbPaginatedResponse<TmdbMovieDto>>('movie/upcoming');

    const homeData: HomeScreenData = {
      trending: (trendingRes.results || []).map(mapTmdbMovieToNormalized),
      popular: (popularRes.results || []).map(mapTmdbMovieToNormalized),
      topRated: (topRatedRes.results || []).map(mapTmdbMovieToNormalized),
      upcoming: (upcomingRes.results || []).map(mapTmdbMovieToNormalized),
    };

    memoryCache.set(cacheKey, homeData);
    return homeData;
  }

  /**
   * Search movies by title query string
   */
  public async searchMovies(
    query: string,
    page: number = 1
  ): Promise<NormalizedPaginatedResponse<ReturnType<typeof mapTmdbMovieToNormalized>>> {
    const normalizedQuery = query.toLowerCase().trim();
    const cacheKey = `movies:search:${normalizedQuery}:p${page}`;
    const cached = memoryCache.get<NormalizedPaginatedResponse<ReturnType<typeof mapTmdbMovieToNormalized>>>(cacheKey);
    if (cached) {
      return cached;
    }

    const rawResponse = await tmdbClient.get<TmdbPaginatedResponse<TmdbMovieDto>>('search/movie', {
      params: {
        query: normalizedQuery,
        page,
      },
    });

    const result = mapTmdbPaginatedResponseToNormalized(rawResponse, mapTmdbMovieToNormalized);
    memoryCache.set(cacheKey, result);
    return result;
  }

  /**
   * Discover movies using filters (genre, sort, year, page)
   */
  public async discoverMovies(
    options: DiscoverQueryParams
  ): Promise<NormalizedPaginatedResponse<ReturnType<typeof mapTmdbMovieToNormalized>>> {
    const page = options.page || 1;
    const genre = options.genre ? String(options.genre) : '';
    const sort = options.sort || 'popularity.desc';
    const year = options.year ? String(options.year) : '';

    const cacheKey = `movies:discover:g-${genre}:s-${sort}:y-${year}:p${page}`;
    const cached = memoryCache.get<NormalizedPaginatedResponse<ReturnType<typeof mapTmdbMovieToNormalized>>>(cacheKey);
    if (cached) {
      return cached;
    }

    const tmdbParams: Record<string, string | number> = {
      page,
      sort_by: sort,
    };

    if (genre) {
      tmdbParams.with_genres = genre;
    }

    if (year) {
      tmdbParams.primary_release_year = year;
    }

    const rawResponse = await tmdbClient.get<TmdbPaginatedResponse<TmdbMovieDto>>('discover/movie', {
      params: tmdbParams,
    });

    const result = mapTmdbPaginatedResponseToNormalized(rawResponse, mapTmdbMovieToNormalized);
    memoryCache.set(cacheKey, result);
    return result;
  }

  /**
   * Get detailed movie information by movie ID
   */
  public async getMovieDetails(movieId: number): Promise<NormalizedMovieDetails> {
    const cacheKey = `movies:detail:${movieId}`;
    const cached = memoryCache.get<NormalizedMovieDetails>(cacheKey);
    if (cached) {
      return cached;
    }

    const rawResponse = await tmdbClient.get<TmdbMovieDetailsDto>(`movie/${movieId}`, {
      params: {
        append_to_response: 'videos',
      },
    });

    const result = mapTmdbMovieDetailsToNormalized(rawResponse);
    memoryCache.set(cacheKey, result);
    return result;
  }
}

export const movieService = new MovieService();
