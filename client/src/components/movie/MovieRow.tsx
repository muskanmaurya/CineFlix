import type { NormalizedMovie } from '../../types/api';
import MovieCard from './MovieCard';

export default function MovieRow({ title, movies, savedMovieIds }: { title: string; movies: NormalizedMovie[]; savedMovieIds?: Set<number> }) {
  return (
    <section aria-labelledby={`${title}-heading`}>
      <div className="mb-4 flex items-end justify-between">
        <h2 id={`${title}-heading`} className="text-xl font-bold tracking-tight text-white">{title}</h2>
        <span className="text-xs uppercase tracking-widest text-slate-600">{movies.length} titles</span>
      </div>
      <div className="grid grid-flow-col auto-cols-[minmax(140px,180px)] gap-4 overflow-x-auto pb-3 sm:auto-cols-[minmax(160px,200px)]">
        {movies.map((movie) => <MovieCard key={movie.id} movie={movie} isSaved={savedMovieIds?.has(movie.id)} />)}
      </div>
    </section>
  );
}