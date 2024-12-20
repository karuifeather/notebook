import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTools } from '@fortawesome/free-solid-svg-icons';

import { Button } from './button.tsx';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center px-8 py-12 max-w-xl bg-white dark:bg-gray-800 rounded-xl shadow-xl">
        {/* Illustration */}
        <div className="mb-8 flex items-center justify-center">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
            <FontAwesomeIcon icon={faTools} className="w-10 h-10" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">
          Page Not Found
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Oops! The page you’re looking for doesn’t exist or the feature is
          currently under development.
        </p>

        {/* Button */}
        <div className="mt-8">
          <Button to="/" cta>
            Go Back Home
          </Button>
        </div>
      </div>
    </div>
  );
}
