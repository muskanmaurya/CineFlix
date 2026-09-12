import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addWishlistItem, getWishlist, removeWishlistItem } from '../services/wishlist';
import type { WishlistItem } from '../types/api';

export const wishlistQueryKey = ['wishlist'] as const;

export function useWishlist() {
  return useQuery({
    queryKey: wishlistQueryKey,
    queryFn: getWishlist,
    staleTime: 2 * 60 * 1000,
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addWishlistItem,
    onSuccess: (item) => {
      queryClient.setQueryData<WishlistItem[]>(wishlistQueryKey, (current) => {
        const withoutDuplicate = (current ?? []).filter((saved) => saved.movieId !== item.movieId);
        return [item, ...withoutDuplicate];
      });
      void queryClient.invalidateQueries({ queryKey: wishlistQueryKey });
    },
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeWishlistItem,
    onSuccess: (_result, movieId) => {
      queryClient.setQueryData<WishlistItem[]>(wishlistQueryKey, (current) =>
        (current ?? []).filter((item) => item.movieId !== movieId)
      );
      void queryClient.invalidateQueries({ queryKey: wishlistQueryKey });
    },
  });
}

export function wishlistIds(items: WishlistItem[] | undefined): Set<number> {
  return new Set((items ?? []).map((item) => item.movieId));
}