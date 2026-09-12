import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../middleware/errorHandler';
import { wishlistService } from './wishlist.service';
import {
  addWishlistBodySchema,
  deleteWishlistParamSchema,
  visitorIdSchema,
} from './wishlist.validation';

class ValidationError extends Error implements AppError {
  public statusCode = 400;
  public code = 'VALIDATION_ERROR';

  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class WishlistController {
  /**
   * Helper to extract and validate X-Visitor-Id header
   */
  private getVisitorId(req: Request): string {
    const rawVisitorId = req.headers['x-visitor-id'] || req.headers['X-Visitor-Id'];
    
    if (!rawVisitorId || Array.isArray(rawVisitorId)) {
      throw new ValidationError('Header "X-Visitor-Id" is required');
    }

    const parsed = visitorIdSchema.safeParse(rawVisitorId);
    if (!parsed.success) {
      const issue = parsed.error.issues[0]?.message || 'Header "X-Visitor-Id" must be a valid UUID';
      throw new ValidationError(issue);
    }

    return parsed.data;
  }

  /**
   * GET /api/v1/wishlist
   */
  public getWishlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const visitorId = this.getVisitorId(req);
      const items = await wishlistService.getWishlist(visitorId);

      res.status(200).json({
        success: true,
        data: items,
      });
    } catch (err) {
      next(err);
    }
  };

  /**
   * POST /api/v1/wishlist
   */
  public addToWishlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const visitorId = this.getVisitorId(req);

      const parsedBody = addWishlistBodySchema.safeParse(req.body);
      if (!parsedBody.success) {
        const issue = parsedBody.error.issues[0]?.message || 'Invalid wishlist request body';
        throw new ValidationError(issue);
      }

      const item = await wishlistService.addToWishlist(visitorId, parsedBody.data);

      res.status(201).json({
        success: true,
        data: item,
      });
    } catch (err) {
      next(err);
    }
  };

  /**
   * DELETE /api/v1/wishlist/:movieId
   */
  public removeFromWishlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const visitorId = this.getVisitorId(req);

      const parsedParams = deleteWishlistParamSchema.safeParse(req.params);
      if (!parsedParams.success) {
        const issue = parsedParams.error.issues[0]?.message || 'Invalid movieId URL parameter';
        throw new ValidationError(issue);
      }

      const { movieId } = parsedParams.data;
      await wishlistService.removeFromWishlist(visitorId, movieId);

      res.status(200).json({
        success: true,
        data: {
          message: `Movie ${movieId} removed from wishlist`,
        },
      });
    } catch (err) {
      next(err);
    }
  };
}

export const wishlistController = new WishlistController();
