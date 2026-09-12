export const TMDB_CONSTANTS = {
  DEFAULT_BASE_URL: 'https://api.themoviedb.org/3',
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  POSTER_SIZE: 'w500',
  BACKDROP_SIZE: 'w1280',
  PROFILE_SIZE: 'h632',
  ORIGINAL_SIZE: 'original',
  DEFAULT_TIMEOUT_MS: 8000, // 8 seconds timeout
  DEFAULT_LANGUAGE: 'en-US',
  FALLBACK_POSTER_URL: 'https://via.placeholder.com/500x750?text=No+Poster+Available',
  FALLBACK_BACKDROP_URL: 'https://via.placeholder.com/1280x720?text=No+Backdrop+Available',
} as const;
