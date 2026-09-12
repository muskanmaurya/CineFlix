import type { ReactNode } from 'react';

interface PlaceholderPageProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export default function PlaceholderPage({ title, description, children }: PlaceholderPageProps) {
  return (
    <section className="space-y-3">
      <p className="text-sm font-medium uppercase tracking-widest text-red-400">Cineflix</p>
      <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
      <p className="max-w-xl text-slate-400">{description}</p>
      {children}
    </section>
  );
}