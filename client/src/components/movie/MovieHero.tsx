import { Play, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { NormalizedMovie } from '../../types/api';
import { useState } from 'react';

export default function MovieHero({ movie }: { movie: NormalizedMovie }) {
  const [backdropFailed, setBackdropFailed] = useState(false);

  return (
    <section className="relative isolate min-h-[360px] overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      {movie.backdropUrl && !backdropFailed && (
        <img src={movie.backdropUrl} alt="" onError={() => setBackdropFailed(true)} className="absolute inset-0 -z-10 h-full w-full object-cover opacity-45" />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950 via-slate-950/75 to-slate-950/20" />
      <div className="flex min-h-[360px] max-w-xl flex-col justify-end p-6 sm:p-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-red-300">Featured tonight</p>
        <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">{movie.title}</h1>
        <div className="mt-4 flex items-center gap-4 text-sm text-slate-300">
          <span className="flex items-center gap-1 text-amber-300"><Star className="h-4 w-4 fill-current" /> {typeof movie.rating === 'number' ? movie.rating.toFixed(1) : 'N/A'}</span>
          <span>{movie.releaseDate?.slice(0, 4) || 'New release'}</span>
        </div>
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-300">{movie.overview}</p>
        <Link to={`/movie/${movie.id}`} className="mt-6 inline-flex w-fit items-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300">
          <Play className="h-4 w-4 fill-current" /> View details
        </Link>
      </div>
    </section>
  );
}