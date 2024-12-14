import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTools } from '@fortawesome/free-solid-svg-icons';

import { Button } from '../button/button.tsx';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center px-6 py-12 max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        {/* Illustration */}
        <div className="mb-6">
          <FontAwesomeIcon
            icon={faTools}
            className="w-16 h-16 text-primary-light dark:text-primary-dark"
          />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Feature Not Found
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Oops! The page you're looking for doesn’t exist or the feature is
          currently being built.
        </p>

        {/* Button */}
        <div className="mt-6">
          <Button to="/">Go back home</Button>
        </div>
      </div>
    </div>
  );
}
