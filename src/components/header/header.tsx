import { Link } from 'react-router-dom';
import { Button } from '../button/button.tsx';

export default function Header() {
  return (
    <header className=" w-full z-50 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2 text-2xl font-bold tracking-wide text-gray-800 dark:text-primary-dark hover:text-primary-light  transition-colors cursor-pointer">
          <span className="font-extrabold">Unfeathered Notes</span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-6 text-lg">
          <Link
            to="/features"
            className="text-gray-600 dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-dark transition"
          >
            Features
          </Link>
          <Link
            to="/pricing"
            className="text-gray-600 dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-dark transition"
          >
            Pricing
          </Link>
          <Link
            to="/about"
            className="text-gray-600 dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-dark transition"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-gray-600 dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-dark transition"
          >
            Contact
          </Link>
        </nav>

        {/* CTA Button */}
        <Button to="/signup" cta>
          Sign Up
        </Button>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-800 dark:text-gray-100 focus:outline-none"
          aria-label="Toggle Menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
