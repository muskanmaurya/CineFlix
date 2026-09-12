import { env } from '../../config/env';
import { logger } from '../../middleware/logger';
import { TMDB_CONSTANTS } from './tmdb.constants';
import { TmdbApiError, TmdbConfigurationError, TmdbTimeoutError } from './tmdb.errors';

export interface TmdbRequestOptions {
  params?: Record<string, string | number | boolean | undefined | null>;
  timeoutMs?: number;
  headers?: Record<string, string>;
}

export class TmdbClient {
  private get baseUrl(): string {
    return env.TMDB_BASE_URL || TMDB_CONSTANTS.DEFAULT_BASE_URL;
  }

  private get apiKey(): string {
    const key = env.TMDB_API_KEY || '';
    return key === 'your_tmdb_api_key_here' ? '' : key;
  }

  private get readAccessToken(): string {
    const token = env.TMDB_READ_ACCESS_TOKEN || '';
    return token === 'your_tmdb_bearer_read_access_token_here' ? '' : token;
  }

  /**
   * Helper to verify configuration has at least one valid authentication credential
   */
  private ensureConfigured(): void {
    if (!this.apiKey && !this.readAccessToken) {
      throw new TmdbConfigurationError(
        'TMDB authentication credentials (TMDB_API_KEY or TMDB_READ_ACCESS_TOKEN) are missing.'
      );
    }
  }

  /**
   * Redacts sensitive API keys and tokens from URLs and log messages
   */
  private redactSecrets(str: string): string {
    let sanitized = str;
    if (this.apiKey) {
      sanitized = sanitized.replace(new RegExp(this.apiKey, 'g'), '[REDACTED_API_KEY]');
    }
    if (this.readAccessToken) {
      sanitized = sanitized.replace(new RegExp(this.readAccessToken, 'g'), '[REDACTED_TOKEN]');
    }
    return sanitized;
  }

  /**
   * Make a GET request to the TMDB API
   */
  public async get<T>(endpoint: string, options: TmdbRequestOptions = {}, retries: number = 1): Promise<T> {
    this.ensureConfigured();

    const timeoutMs = options.timeoutMs ?? TMDB_CONSTANTS.DEFAULT_TIMEOUT_MS;
    const url = new URL(`${this.baseUrl.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`);

    // Build Query Parameters
    const searchParams = new URLSearchParams();
    searchParams.set('language', TMDB_CONSTANTS.DEFAULT_LANGUAGE);

    // If using v3 API key and no Bearer token, attach api_key query param
    if (this.apiKey && !this.readAccessToken) {
      searchParams.set('api_key', this.apiKey);
    }

    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.set(key, String(value));
        }
      });
    }

    url.search = searchParams.toString();

    // Build Headers
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'User-Agent': 'Cineflix-Server/1.0.0 (Node.js)',
      ...options.headers,
    };

    // Prefer Bearer Token if available
    if (this.readAccessToken) {
      headers['Authorization'] = `Bearer ${this.readAccessToken}`;
    }

    const sanitizedUrlStr = this.redactSecrets(url.toString());

    try {
      logger.debug(`[TMDB Client] Requesting GET ${sanitizedUrlStr}`);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers,
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (!response.ok) {
        let errorMessage = `TMDB API returned HTTP ${response.status} ${response.statusText}`;
        try {
          const errorBody = (await response.json()) as { status_message?: string };
          if (errorBody?.status_message) {
            errorMessage = `TMDB API Error (${response.status}): ${errorBody.status_message}`;
          }
        } catch {
          // Ignore JSON parse errors on non-2xx responses
        }

        const sanitizedErrorMsg = this.redactSecrets(errorMessage);
        logger.warn(`[TMDB Client] Non-2xx response: ${sanitizedErrorMsg}`);
        throw new TmdbApiError('TMDB request failed', response.status >= 500 ? 502 : response.status);
      }

      const data = (await response.json()) as T;
      return data;
    } catch (err: unknown) {
      if (err instanceof TmdbApiError || err instanceof TmdbConfigurationError) {
        throw err;
      }

      if (err instanceof Error) {
        if (err.name === 'AbortError' || err.name === 'TimeoutError') {
          logger.error(`[TMDB Client] Request timeout after ${timeoutMs}ms for ${sanitizedUrlStr}`);
          throw new TmdbTimeoutError(`TMDB request timed out after ${timeoutMs}ms`);
        }

        // Single retry on ECONNRESET / network socket drop
        if (retries > 0 && err.message.includes('ECONNRESET')) {
          logger.warn(`[TMDB Client] Connection reset by peer for ${sanitizedUrlStr}. Retrying...`);
          return this.get<T>(endpoint, options, retries - 1);
        }

        const sanitizedMsg = this.redactSecrets(err.message);
        logger.error({ err }, `[TMDB Client] Network/Unexpected error: ${sanitizedMsg}`);
        throw new TmdbApiError('TMDB service is unavailable', 502);
      }

      throw new TmdbApiError('An unknown error occurred during TMDB API request', 500);
    }
  }
}

// Export singleton instance for convenience
export const tmdbClient = new TmdbClient();
