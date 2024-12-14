import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark py-8 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Company Info */}
        <div className="space-y-4">
          <h2 className="text-2xl font-extrabold text-primary-light dark:text-primary-dark">
            Unfeathered
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Breaking Limits, Building Futures
          </p>
        </div>

        {/* Navigation Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Quick Links</h3>
          <nav className="flex flex-col space-y-2">
            <Link
              to="/features"
              className="hover:text-primary-light dark:hover:text-primary-dark transition"
            >
              Features
            </Link>

            <Link
              to="/about"
              className="hover:text-primary-light dark:hover:text-primary-dark transition"
            >
              About Us
            </Link>
          </nav>
        </div>

        {/* Social Media and Contact */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Connect with Us</h3>
          <div className="flex space-x-6">
            {/* X (formerly Twitter) */}
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className="text-gray-600 dark:text-gray-400 hover:text-primary-light dark:hover:text-primary-dark transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-6 h-6"
              >
                <path d="M17.8 2H6.2C3.5 2 2 3.5 2 6.2v11.6c0 2.7 1.5 4.2 4.2 4.2h11.6c2.7 0 4.2-1.5 4.2-4.2V6.2c0-2.7-1.5-4.2-4.2-4.2ZM9.4 7.7h1.2l3.4 3.3 3.4-3.3h1.2L14.3 12l3.3 4.2h-1.2L12.8 12l-3.4 4.2H8.2L11.5 12 8.2 7.7h1.2Z" />
              </svg>
            </a>
            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-gray-600 dark:text-gray-400 hover:text-primary-light dark:hover:text-primary-dark transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 2h-3a6 6 0 00-6 6v3H6v4h3v8h4v-8h3l1-4h-4V8a2 2 0 012-2h3z"
                />
              </svg>
            </a>
            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-gray-600 dark:text-gray-400 hover:text-primary-light dark:hover:text-primary-dark transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2h-1a2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
                />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-8 pt-4 border-t border-gray-300 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()} Unfeathered. All rights reserved.
      </div>
    </footer>
  );
}
