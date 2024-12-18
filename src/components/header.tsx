import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="w-full z-50 backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          aria-label="Unfeathered Notes - Home"
          className="flex items-center text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white hover:opacity-90 transition-opacity"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            Unfeathered Notes
          </span>
        </Link>

        {/* CTA Button */}
        <Link
          to="/app/create-notebook"
          className="ml-auto inline-block rounded-full px-4 sm:px-5 md:px-6 py-2 text-xs sm:text-sm md:text-base font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
        >
          Create Notebook
        </Link>
      </div>
    </header>
  );
}
