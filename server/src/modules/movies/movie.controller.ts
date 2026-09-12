import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../../middleware/errorHandler';
import { createSuccessResponse } from './movie.mapper';
import { movieService } from './movie.service';
import { discoverQuerySchema, movieIdSchema, searchQuerySchema } from './movie.validation';

/**
 * Custom error helper for validation failures
 */
class ValidationError extends Error implements AppError {
  public statusCode = 400;
  public code = 'VALIDATION_ERROR';

  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class MovieController {
  /**
   * GET /api/v1/movies/home
   */
  public getHomeScreen = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await movieService.getHomeScreen();
      res.status(200).json(createSuccessResponse(data));
    } catch (err) {
      next(err);
    }
  };

  /**
   * GET /api/v1/movies/search?q=query&page=1
   */
  public searchMovies = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = searchQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        const firstIssue = parsed.error.issues[0]?.message || 'Invalid search parameters';
        throw new ValidationError(firstIssue);
      }

      const { q, page } = parsed.data;
      const result = await movieService.searchMovies(q, page);

      res.status(200).json(
        createSuccessResponse(result.results, {
          page: result.page,
          totalPages: result.totalPages,
          totalResults: result.totalResults,
        })
      );
    } catch (err) {
      if (err instanceof ZodError) {
        next(new ValidationError(err.issues[0]?.message || 'Invalid search parameters'));
      } else {
        next(err);
      }
    }
  };

  /**
   * GET /api/v1/movies/discover?page=1&genre=28&sort=popularity.desc&year=2024
   */
  public discoverMovies = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = discoverQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        const firstIssue = parsed.error.issues[0]?.message || 'Invalid discover parameters';
        throw new ValidationError(firstIssue);
      }

      const result = await movieService.discoverMovies(parsed.data);

      res.status(200).json(
        createSuccessResponse(result.results, {
          page: result.page,
          totalPages: result.totalPages,
          totalResults: result.totalResults,
        })
      );
    } catch (err) {
      if (err instanceof ZodError) {
        next(new ValidationError(err.issues[0]?.message || 'Invalid discover parameters'));
      } else {
        next(err);
      }
    }
  };

  /**
   * GET /api/v1/movies/:id
   */
  public getMovieDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = movieIdSchema.safeParse(req.params);
      if (!parsed.success) {
        const firstIssue = parsed.error.issues[0]?.message || 'Invalid movie ID';
        throw new ValidationError(firstIssue);
      }

      const movieDetails = await movieService.getMovieDetails(parsed.data.id);
      res.status(200).json(createSuccessResponse(movieDetails));
    } catch (err) {
      if (err instanceof ZodError) {
        next(new ValidationError(err.issues[0]?.message || 'Invalid movie ID'));
      } else {
        next(err);
      }
    }
  };
}

export const movieController = new MovieController();
