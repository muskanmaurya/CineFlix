export const genreOptions = [
  { label: 'All genres', value: '' },
  { label: 'Action', value: '28' },
  { label: 'Adventure', value: '12' },
  { label: 'Comedy', value: '35' },
  { label: 'Drama', value: '18' },
  { label: 'Horror', value: '27' },
  { label: 'Science Fiction', value: '878' },
  { label: 'Thriller', value: '53' },
  { label: 'Romance', value: '10749' },
];

export const sortOptions = [
  { label: 'Popularity', value: 'popularity.desc' },
  { label: 'Highest rated', value: 'vote_average.desc' },
  { label: 'Newest releases', value: 'primary_release_date.desc' },
  { label: 'Popularity (low to high)', value: 'popularity.asc' },
];

interface FilterBarProps {
  genre: string;
  sort: string;
  onGenreChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

export default function FilterBar({ genre, sort, onGenreChange, onSortChange }: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <label className="flex flex-1 flex-col gap-1 text-xs font-semibold uppercase tracking-widest text-slate-500">
        Genre
        <select value={genre} onChange={(event) => onGenreChange(event.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-white outline-none focus:border-red-400">
          {genreOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </label>
      <label className="flex flex-1 flex-col gap-1 text-xs font-semibold uppercase tracking-widest text-slate-500">
        Sort by
        <select value={sort} onChange={(event) => onSortChange(event.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-white outline-none focus:border-red-400">
          {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </label>
    </div>
  );
}