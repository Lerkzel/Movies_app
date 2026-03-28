import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
      setQuery('');
    }
  };

  const navLinks = [
    { to: '/', label: 'Trending' },
    { to: '/popular', label: 'Popular' },
    { to: '/top-rated', label: 'Top Rated' },
    { to: '/upcoming', label: 'Upcoming' },
    { to: '/favorites', label: '⭐ Favorites' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center gap-3">
        <Link to="/" className="text-yellow-400 font-bold text-2xl shrink-0 tracking-tight">
          🎬 CineScope
        </Link>

        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                location.pathname === to
                  ? 'bg-yellow-400 text-black'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies..."
            className="flex-1 sm:w-56 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-colors"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-lg text-sm hover:bg-yellow-300 transition-colors"
          >
            Search
          </button>
        </form>

        {/* Mobile nav */}
        <div className="flex md:hidden items-center gap-1 flex-wrap justify-center">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                location.pathname === to
                  ? 'bg-yellow-400 text-black'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
