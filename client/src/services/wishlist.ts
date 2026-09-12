import { apiRequest } from '../lib/api';
import { getVisitorId } from '../lib/visitor';
import type { WishlistItem } from '../types/api';

const visitorHeaders = () => ({
  'X-Visitor-Id': getVisitorId(),
});

export interface AddWishlistItemInput {
  movieId: number;
  title: string;
  posterPath?: string | null;
  releaseDate?: string | null;
  rating?: number | null;
}

export function getWishlist(): Promise<WishlistItem[]> {
  return apiRequest<WishlistItem[]>('/wishlist', {
    headers: visitorHeaders(),
  });
}

export function addWishlistItem(item: AddWishlistItemInput): Promise<WishlistItem> {
  return apiRequest<WishlistItem>('/wishlist', {
    method: 'POST',
    headers: visitorHeaders(),
    body: JSON.stringify(item),
  });
}

export function removeWishlistItem(movieId: number): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/wishlist/${movieId}`, {
    method: 'DELETE',
    headers: visitorHeaders(),
  });
}