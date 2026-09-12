import type { ReactNode } from 'react';

export default function EmptyState({ title, message, action }: { title: string; message: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-700 px-5 py-12 text-center">
      <p className="font-semibold text-slate-200">{title}</p>
      <p className="mt-2 text-sm text-slate-500">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}