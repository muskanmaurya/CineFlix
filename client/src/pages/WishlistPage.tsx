import { Link } from 'react-router-dom';
import EmptyState from '../components/feedback/EmptyState';
import ErrorState from '../components/feedback/ErrorState';
import LoadingState from '../components/feedback/LoadingState';
import WishlistCard from '../components/wishlist/WishlistCard';
import { useWishlist } from '../hooks/useWishlist';

export default function WishlistPage() {
  const { data: items, isLoading, isError, refetch } = useWishlist();

  if (isLoading) return <LoadingState label="Loading your wishlist..." />;
  if (isError) return <ErrorState message="Your wishlist could not be loaded. Please try again." onRetry={() => void refetch()} />;
  if (!items?.length) {
    return (
      <EmptyState
        title="Your wishlist is empty"
        message="Save movies while browsing and they will stay here for your next movie night."
        action={<Link to="/discover" className="inline-flex rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300">Browse movies</Link>}
      />
    );
  }

  return (
    <section className="space-y-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-300">Saved for later</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-white">My Wishlist</h1>
          <p className="mt-2 text-slate-400">{items.length} {items.length === 1 ? 'movie' : 'movies'} saved.</p>
        </div>
        <Link to="/discover" className="text-sm font-semibold text-red-300 hover:text-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300">Discover more movies</Link>
      </header>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {items.map((item) => <WishlistCard key={item.id} item={item} />)}
      </div>
    </section>
  );
}