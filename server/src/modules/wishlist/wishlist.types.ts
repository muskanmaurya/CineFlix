export interface AddWishlistItemDto {
  movieId: number;
  title: string;
  posterPath?: string | null;
  releaseDate?: string | null;
  rating?: number | null;
}

export interface WishlistItemResponse {
  id: string;
  visitorId: string;
  movieId: number;
  title: string;
  posterPath: string | null;
  releaseDate: string | null;
  rating: number | null;
  createdAt: string;
  updatedAt: string;
}
