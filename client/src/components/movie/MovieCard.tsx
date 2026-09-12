import { Bookmark, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { NormalizedMovie } from '../../types/api';
import { useState, type MouseEvent } from 'react';
import { useAddToWishlist, useRemoveFromWishlist } from '../../hooks/useWishlist';

function getYear(date: string) {
  return date ? date.slice(0, 4) : 'Year unknown';
}

interface MovieCardProps {
  movie: NormalizedMovie;
  isSaved?: boolean;
}

export default function MovieCard({ movie, isSaved = false }: MovieCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const addMutation = useAddToWishlist();
  const removeMutation = useRemoveFromWishlist();
  const mutation = isSaved ? removeMutation : addMutation;

  function toggleWishlist(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (mutation.isPending) return;
    if (isSaved) {
      removeMutation.mutate(movie.id);
      return;
    }

    addMutation.mutate({
      movieId: movie.id,
      title: movie.title,
      posterPath: movie.posterUrl,
      releaseDate: movie.releaseDate || null,
      rating: movie.rating,
    });
  }

  return (
    <div className="group relative min-w-0">
      <Link
        to={`/movie/${movie.id}`}
        className="block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
        aria-label={`View details for ${movie.title}`}
      >
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-slate-800">
        {movie.posterUrl && !imageFailed ? (
          <img
            src={movie.posterUrl}
            alt={`${movie.title} poster`}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center p-4 text-center text-sm font-medium text-slate-500">
            Poster unavailable
          </div>
        )}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/85 to-transparent px-3 pb-3 pt-8 text-xs">
            <span className="text-slate-300">{getYear(movie.releaseDate)}</span>
            <span className="flex items-center gap-1 font-semibold text-amber-300">
              <Star className="h-3.5 w-3.5 fill-current" />
              {typeof movie.rating === 'number' ? movie.rating.toFixed(1) : 'N/A'}
            </span>
          </div>
        </div>
        <h3 className="mt-3 line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-slate-100 group-hover:text-red-300">
          {movie.title || 'Untitled movie'}
        </h3>
      </Link>
      <button
        type="button"
        onClick={toggleWishlist}
        disabled={mutation.isPending}
        aria-label={isSaved ? `Remove ${movie.title} from wishlist` : `Add ${movie.title} to wishlist`}
        aria-pressed={isSaved}
        title={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
        className="absolute right-2 top-2 rounded-full bg-slate-950/80 p-2 text-white backdrop-blur transition hover:bg-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:cursor-wait disabled:opacity-60"
      >
        <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current text-red-300' : ''}`} />
      </button>
      {mutation.isError && <p className="mt-1 text-xs text-red-300" role="alert">Could not update your wishlist. Try again.</p>}
    </div>
  );
}