import MovieHero from '../components/movie/MovieHero';
import MovieRow from '../components/movie/MovieRow';
import EmptyState from '../components/feedback/EmptyState';
import ErrorState from '../components/feedback/ErrorState';
import LoadingState from '../components/feedback/LoadingState';
import { useHomeMovies } from '../hooks/useMovies';
import { useWishlist, wishlistIds } from '../hooks/useWishlist';

export default function HomePage() {
  const { data, isLoading, isError, refetch } = useHomeMovies();
  const wishlist = useWishlist();
  const savedMovieIds = wishlistIds(wishlist.data);

  if (isLoading) return <LoadingState label="Curating your movie night..." />;
  if (isError || !data) return <ErrorState onRetry={() => void refetch()} />;

  const featured = data.trending[0] ?? data.popular[0];
  if (!featured) return <EmptyState title="No movies available" message="The catalog is empty right now. Check back soon." />;

  return (
    <div className="space-y-12">
      <MovieHero movie={featured} />
      <div className="space-y-12">
        <MovieRow title="Trending now" movies={data.trending} savedMovieIds={savedMovieIds} />
        <MovieRow title="Popular picks" movies={data.popular} savedMovieIds={savedMovieIds} />
        <MovieRow title="Top rated" movies={data.topRated} savedMovieIds={savedMovieIds} />
        <MovieRow title="Coming soon" movies={data.upcoming} savedMovieIds={savedMovieIds} />
      </div>
    </div>
  );
}