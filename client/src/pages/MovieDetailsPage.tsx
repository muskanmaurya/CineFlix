import { ArrowLeft, CalendarDays, Clock3, Star } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import EmptyState from '../components/feedback/EmptyState';
import ErrorState from '../components/feedback/ErrorState';
import LoadingState from '../components/feedback/LoadingState';
import { useMovieDetails } from '../hooks/useMovies';
import { useState } from 'react';
import { useAddToWishlist, useRemoveFromWishlist, useWishlist } from '../hooks/useWishlist';

export default function MovieDetailsPage() {
  const { id } = useParams();
  const { data: movie, isLoading, isError, refetch } = useMovieDetails(id);
  const [posterFailed, setPosterFailed] = useState(false);
  const [backdropFailed, setBackdropFailed] = useState(false);
  const wishlist = useWishlist();
  const addMutation = useAddToWishlist();
  const removeMutation = useRemoveFromWishlist();

  if (isLoading) return <LoadingState label="Loading movie details..." />;
  if (isError || !movie) return <ErrorState message="This movie could not be loaded. Please try again." onRetry={() => void refetch()} />;

  const usableTrailers = movie.trailers.filter(
    (trailer) => trailer.site.toLowerCase() === 'youtube' && trailer.embedUrl
  );
  const isSaved = wishlist.data?.some((item) => item.movieId === movie.id) ?? false;
  const isWishlistPending = addMutation.isPending || removeMutation.isPending;

  function toggleWishlist() {
    if (!movie || isWishlistPending) return;
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
    <article className="space-y-8">
      <Link to="/discover" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400">
        <ArrowLeft className="h-4 w-4" /> Back to browsing
      </Link>
      <section className="relative isolate overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        {movie.backdropUrl && !backdropFailed && <img src={movie.backdropUrl} alt="" onError={() => setBackdropFailed(true)} className="absolute inset-0 -z-10 h-full w-full object-cover opacity-35" />}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/50" />
        <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[220px_1fr]">
          <div className="aspect-[2/3] overflow-hidden rounded-xl bg-slate-800">
            {movie.posterUrl && !posterFailed ? <img src={movie.posterUrl} alt={`${movie.title} poster`} className="h-full w-full object-cover" onError={() => setPosterFailed(true)} /> : <div className="flex h-full items-center justify-center p-5 text-center text-sm text-slate-500">Poster unavailable</div>}
          </div>
          <div className="self-end">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-widest text-red-300">
              <span>{movie.status || 'Movie'}</span>
              {movie.releaseDate && <span>{movie.releaseDate.slice(0, 4)}</span>}
            </div>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-6xl">{movie.title}</h1>
            {movie.tagline && <p className="mt-3 text-lg italic text-slate-300">{movie.tagline}</p>}
            <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-300">
              <span className="flex items-center gap-1 text-amber-300"><Star className="h-4 w-4 fill-current" /> {typeof movie.rating === 'number' ? movie.rating.toFixed(1) : 'N/A'} ({movie.voteCount?.toLocaleString?.() ?? 'N/A'} votes)</span>
              {movie.releaseDate && <span className="flex items-center gap-1"><CalendarDays className="h-4 w-4" /> {movie.releaseDate}</span>}
              {movie.runtime !== null && <span className="flex items-center gap-1"><Clock3 className="h-4 w-4" /> {movie.runtime} min</span>}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">{movie.genres.map((genre) => <span key={genre.id} className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">{genre.name}</span>)}</div>
            <button
              type="button"
              onClick={toggleWishlist}
              disabled={isWishlistPending}
              aria-pressed={isSaved}
              className="mt-7 rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-red-400 hover:text-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:cursor-wait disabled:opacity-60"
            >
              {isWishlistPending ? 'Updating...' : isSaved ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
            {(addMutation.isError || removeMutation.isError) && <p className="mt-2 text-sm text-red-300" role="alert">Could not update your wishlist. Try again.</p>}
          </div>
        </div>
      </section>
      <section className="max-w-3xl space-y-3">
        <h2 className="text-xl font-bold text-white">Overview</h2>
        <p className="leading-7 text-slate-400">{movie.overview || 'No overview available.'}</p>
      </section>
      {usableTrailers.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">Trailers</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {usableTrailers.map((trailer) => (
              <div key={trailer.id} className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
                <div className="aspect-video"><iframe className="h-full w-full" src={trailer.embedUrl!} title={trailer.name} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div>
                <p className="truncate px-4 py-3 text-sm font-semibold text-slate-200">{trailer.name}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      {usableTrailers.length === 0 && <EmptyState title="No trailer available" message="There is no usable YouTube trailer for this title." />}
    </article>
  );
}