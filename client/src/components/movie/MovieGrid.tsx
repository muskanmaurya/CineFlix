import type { NormalizedMovie } from '../../types/api';
import MovieCard from './MovieCard';

export default function MovieGrid({ movies, savedMovieIds }: { movies: NormalizedMovie[]; savedMovieIds?: Set<number> }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {movies.map((movie) => <MovieCard key={movie.id} movie={movie} isSaved={savedMovieIds?.has(movie.id)} />)}
    </div>
  );
}