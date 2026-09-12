export default function LoadMoreButton({ onClick, disabled, hidden }: { onClick: () => void; disabled: boolean; hidden: boolean }) {
  if (hidden) return null;
  return (
    <button type="button" onClick={onClick} disabled={disabled} className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-red-400 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50">
      {disabled ? 'Loading more...' : 'Load more movies'}
    </button>
  );
}