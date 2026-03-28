import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
      <footer className="border-t border-gray-800 mt-12 py-6 text-center text-gray-500 text-sm">
        <p>
          Powered by{' '}
          <span className="text-yellow-400 font-medium">TMDB API</span>
          {' '}· CineScope &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
