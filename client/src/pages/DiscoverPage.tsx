import { useEffect, useState } from 'react';
import EmptyState from '../components/feedback/EmptyState';
import ErrorState from '../components/feedback/ErrorState';
import LoadingState from '../components/feedback/LoadingState';
import FilterBar from '../components/discovery/FilterBar';
import LoadMoreButton from '../components/discovery/LoadMoreButton';
import SearchBar from '../components/discovery/SearchBar';
import MovieGrid from '../components/movie/MovieGrid';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useDiscoverMovies, useMovieSearch } from '../hooks/useMovies';
import { useSearchParams } from 'react-router-dom';
import type { NormalizedMovie } from '../types/api';
import { useWishlist, wishlistIds } from '../hooks/useWishlist';

export default function DiscoverPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [genre, setGenre] = useState('');
  const [sort, setSort] = useState('popularity.desc');
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState<NormalizedMovie[]>([]);
  const debouncedQuery = useDebouncedValue(searchInput.trim());
  const search = useMovieSearch(debouncedQuery, page);
  const discover = useDiscoverMovies(genre, sort, page, !debouncedQuery);
  const result = debouncedQuery ? search.data : discover.data;
  const isLoading = debouncedQuery ? search.isLoading : discover.isLoading;
  const isFetching = debouncedQuery ? search.isFetching : discover.isFetching;
  const retry = debouncedQuery ? search.refetch : discover.refetch;
  const isError = debouncedQuery ? search.isError : discover.isError;
  const wishlist = useWishlist();
  const savedMovieIds = wishlistIds(wishlist.data);

  useEffect(() => {
    setPage(1);
    setMovies([]);
  }, [debouncedQuery, genre, sort]);

  useEffect(() => {
    if (!result) return;
    setMovies((current) => {
      if (result.pagination.page === 1) return result.movies;
      const existingIds = new Set(current.map((movie) => movie.id));
      return [...current, ...result.movies.filter((movie) => !existingIds.has(movie.id))];
    });
  }, [result]);

  function updateSearch(value: string) {
    setSearchInput(value);
    setSearchParams(value ? { q: value } : {});
  }

  const hasMore = result ? result.pagination.page < result.pagination.totalPages : false;

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-300">The catalog</p>
        <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">Find your next favorite.</h1>
        <p className="max-w-xl text-slate-400">Search the catalog or browse curated genres, sorted your way.</p>
      </header>
      <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-4 sm:p-5">
        <SearchBar value={searchInput} onChange={setSearchInput} onSubmit={updateSearch} />
        <FilterBar
          genre={genre}
          sort={sort}
          onGenreChange={(value) => { setGenre(value); setPage(1); }}
          onSortChange={(value) => { setSort(value); setPage(1); }}
        />
      </div>
      {isLoading ? <LoadingState /> : isError ? <ErrorState onRetry={() => void retry()} /> : movies.length === 0 ? (
        <EmptyState title={debouncedQuery ? 'No matches found' : 'No movies found'} message={debouncedQuery ? 'Try a different title or broaden your filters.' : 'There are no movies to show for these filters.'} />
      ) : (
        <>
          <MovieGrid movies={movies} savedMovieIds={savedMovieIds} />
          <div className="flex justify-center pt-2">
            <LoadMoreButton onClick={() => setPage((current) => current + 1)} disabled={isFetching} hidden={!hasMore} />
          </div>
        </>
      )}
    </div>
  );
}