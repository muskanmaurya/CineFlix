import { Router } from 'express';
import { wishlistController } from './wishlist.controller';

const router = Router();

// GET /api/v1/wishlist
router.get('/', wishlistController.getWishlist);

// POST /api/v1/wishlist
router.post('/', wishlistController.addToWishlist);

// DELETE /api/v1/wishlist/:movieId
router.delete('/:movieId', wishlistController.removeFromWishlist);

export default router;
