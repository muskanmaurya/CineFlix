import { IWishlistDocument, WishlistModel } from './wishlist.model';
import { AddWishlistItemDto, WishlistItemResponse } from './wishlist.types';

export class WishlistService {
  /**
   * Format Mongoose document into clean internal WishlistItemResponse
   */
  private formatWishlistItem(doc: IWishlistDocument): WishlistItemResponse {
    return {
      id: doc._id.toString(),
      visitorId: doc.visitorId,
      movieId: doc.movieId,
      title: doc.title,
      posterPath: doc.posterPath,
      releaseDate: doc.releaseDate,
      rating: doc.rating,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    };
  }

  /**
   * Retrieve all wishlist items for a given visitor ID, newest first
   */
  public async getWishlist(visitorId: string): Promise<WishlistItemResponse[]> {
    const docs = await WishlistModel.find({ visitorId }).sort({ createdAt: -1 }).exec();
    return docs.map((doc) => this.formatWishlistItem(doc));
  }

  /**
   * Add or update a movie item in visitor's wishlist (idempotent upsert)
   */
  public async addToWishlist(
    visitorId: string,
    item: AddWishlistItemDto
  ): Promise<WishlistItemResponse> {
    const doc = await WishlistModel.findOneAndUpdate(
      { visitorId, movieId: item.movieId },
      {
        $setOnInsert: {
          visitorId,
          movieId: item.movieId,
          title: item.title,
          posterPath: item.posterPath ?? null,
          releaseDate: item.releaseDate ?? null,
          rating: item.rating ?? null,
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    ).exec();

    return this.formatWishlistItem(doc);
  }

  /**
   * Remove a movie from visitor's wishlist
   */
  public async removeFromWishlist(visitorId: string, movieId: number): Promise<boolean> {
    const res = await WishlistModel.deleteOne({ visitorId, movieId }).exec();
    return (res.deletedCount ?? 0) > 0;
  }
}

export const wishlistService = new WishlistService();
