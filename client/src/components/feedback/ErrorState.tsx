import { Link } from 'react-router-dom';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message = 'Something went wrong while loading this page.', onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-red-500/30 bg-red-950/20 px-5 py-8 text-center" role="alert">
      <p className="font-semibold text-red-200">Unable to load movies</p>
      <p className="mt-2 text-sm text-red-200/70">{message}</p>
      <div className="mt-5 flex flex-wrap justify-center gap-4 text-sm font-semibold">
        {onRetry && <button type="button" onClick={onRetry} className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300">Retry</button>}
        <Link to="/discover" className="rounded-lg border border-slate-700 px-4 py-2 text-white hover:border-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300">
          Back to Discover
        </Link>
      </div>
    </div>
  );
}