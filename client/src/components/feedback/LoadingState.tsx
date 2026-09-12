export default function LoadingState({ label = 'Loading movies...' }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 py-12 text-sm text-slate-400" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-700 border-t-red-500" />
      {label}
    </div>
  );
}