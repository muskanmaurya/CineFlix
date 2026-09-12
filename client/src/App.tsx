import { Film } from 'lucide-react';
import { NavLink, Route, Routes } from 'react-router-dom';
import SearchBar from './components/discovery/SearchBar';
import DiscoverPage from './pages/DiscoverPage';
import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import WishlistPage from './pages/WishlistPage';

const navigation = [
  { label: 'Home', to: '/' },
  { label: 'Discover', to: '/discover' },
  { label: 'Wishlist', to: '/wishlist' },
];

export function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <NavLink to="/" className="flex items-center gap-2 text-lg font-bold">
            <Film className="h-5 w-5 text-red-500" />
            Cineflix
          </NavLink>
          <div className="hidden md:block"><SearchBar /></div>
          <nav aria-label="Main navigation" className="flex items-center gap-4 text-sm text-slate-400">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? 'text-white' : 'hover:text-white')}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="border-t border-slate-800 px-6 py-3 md:hidden">
          <div className="mx-auto max-w-6xl"><SearchBar /></div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-12">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/movie/:id" element={<MovieDetailsPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
