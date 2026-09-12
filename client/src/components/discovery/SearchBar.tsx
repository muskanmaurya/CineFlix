import { Search } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
}

export default function SearchBar({ value: controlledValue, onChange, onSubmit }: SearchBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(new URLSearchParams(location.search).get('q') ?? '');

  useEffect(() => {
    if (controlledValue !== undefined) setValue(controlledValue);
  }, [controlledValue]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = value.trim();
    if (onSubmit) onSubmit(trimmed);
    else navigate(trimmed ? `/discover?q=${encodeURIComponent(trimmed)}` : '/discover');
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-sm">
      <label htmlFor="movie-search" className="sr-only">Search movies</label>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
      <input
        id="movie-search"
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          onChange?.(event.target.value);
        }}
        placeholder="Search movies..."
        className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2.5 pl-9 pr-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
      />
    </form>
  );
}