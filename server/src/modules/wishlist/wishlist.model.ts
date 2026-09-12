import mongoose, { Document, Schema } from 'mongoose';

export interface IWishlistDocument extends Document {
  visitorId: string;
  movieId: number;
  title: string;
  posterPath: string | null;
  releaseDate: string | null;
  rating: number | null;
  createdAt: Date;
  updatedAt: Date;
}

const WishlistSchema = new Schema<IWishlistDocument>(
  {
    visitorId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    movieId: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    posterPath: {
      type: String,
      default: null,
    },
    releaseDate: {
      type: String,
      default: null,
    },
    rating: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound UNIQUE index enforcing 1 wishlist entry per (visitorId, movieId)
WishlistSchema.index({ visitorId: 1, movieId: 1 }, { unique: true });

export const WishlistModel = mongoose.model<IWishlistDocument>('Wishlist', WishlistSchema);
