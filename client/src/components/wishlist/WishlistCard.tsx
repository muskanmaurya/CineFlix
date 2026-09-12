import { Bookmark, Star } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRemoveFromWishlist } from '../../hooks/useWishlist';
import type { WishlistItem } from '../../types/api';

function getYear(date: string | null) {
  return date ? date.slice(0, 4) : 'Year unknown';
}

export default function WishlistCard({ item }: { item: WishlistItem }) {
  const [imageFailed, setImageFailed] = useState(false);
  const removeMutation = useRemoveFromWishlist();

  return (
    <div className="min-w-0">
      <Link
        to={`/movie/${item.movieId}`}
        className="group block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
        aria-label={`View details for ${item.title}`}
      >
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-slate-800">
          {item.posterPath && !imageFailed ? (
            <img
              src={item.posterPath}
              alt={`${item.title} poster`}
              loading="lazy"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="flex h-full items-center justify-center p-4 text-center text-sm text-slate-500">
              Poster unavailable
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/85 to-transparent px-3 pb-3 pt-8 text-xs">
            <span className="text-slate-300">{getYear(item.releaseDate)}</span>
            <span className="flex items-center gap-1 font-semibold text-amber-300">
              <Star className="h-3.5 w-3.5 fill-current" /> {item.rating?.toFixed(1) ?? 'N/A'}
            </span>
          </div>
        </div>
        <h2 className="mt-3 line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-slate-100 group-hover:text-red-300">{item.title}</h2>
      </Link>
      <button
        type="button"
        onClick={() => removeMutation.mutate(item.movieId)}
        disabled={removeMutation.isPending}
        aria-label={`Remove ${item.title} from wishlist`}
        title="Remove from wishlist"
        className="mt-2 inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-red-400 hover:text-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:cursor-wait disabled:opacity-60"
      >
        <Bookmark className="h-3.5 w-3.5 fill-current" />
        {removeMutation.isPending ? 'Removing...' : 'Remove'}
      </button>
      {removeMutation.isError && <p className="mt-1 text-xs text-red-300" role="alert">Could not remove this movie. Try again.</p>}
    </div>
  );
}