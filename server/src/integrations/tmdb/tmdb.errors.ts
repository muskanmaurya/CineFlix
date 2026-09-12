import { AppError } from '../../middleware/errorHandler';

export class TmdbApiError extends Error implements AppError {
  public statusCode: number;
  public code: string;

  constructor(message: string, statusCode: number = 502) {
    super(message);
    this.name = 'TmdbApiError';
    this.statusCode = statusCode;
    this.code = 'TMDB_API_ERROR';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class TmdbTimeoutError extends Error implements AppError {
  public statusCode: number;
  public code: string;

  constructor(message: string = 'TMDB request timed out') {
    super(message);
    this.name = 'TmdbTimeoutError';
    this.statusCode = 504;
    this.code = 'TMDB_TIMEOUT_ERROR';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class TmdbConfigurationError extends Error implements AppError {
  public statusCode: number;
  public code: string;

  constructor(message: string = 'TMDB API key or read token is missing in server configuration') {
    super(message);
    this.name = 'TmdbConfigurationError';
    this.statusCode = 500;
    this.code = 'TMDB_CONFIG_ERROR';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
