import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LoadNpmModuleModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNpmModules = async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://registry.npmjs.org/-/v1/search`,
        {
          params: { text: query, size: 10 },
        }
      );
      const modules = response.data.objects.map((obj: any) => obj.package.name);
      setSearchResults(modules);
    } catch (error) {
      console.error('Error fetching npm modules:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddModule = (module: string) => {
    if (!selectedModules.includes(module)) {
      setSelectedModules([...selectedModules, module]);
    }
  };

  const handleRemoveModule = (module: string) => {
    setSelectedModules(selectedModules.filter((mod) => mod !== module));
  };

  const handleInstall = () => {
    console.log('Installing modules:', selectedModules);
    onClose();
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => fetchNpmModules(searchQuery), 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl p-8 relative">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Add NPM Module
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <i className="fas fa-times text-2xl"></i>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Search Section */}
          <div>
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search for npm modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-lg rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-200 p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <i className="fas fa-search absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400"></i>
            </div>

            <div className="mb-6 max-h-60 overflow-y-auto">
              {isLoading ? (
                <p className="text-lg text-gray-500 dark:text-gray-400">
                  Loading...
                </p>
              ) : searchResults.length > 0 ? (
                <ul className="space-y-3">
                  {searchResults.map((module) => (
                    <li
                      key={module}
                      className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-3 rounded-lg shadow-md"
                    >
                      <span className="text-lg text-gray-900 dark:text-gray-200 font-medium">
                        {module}
                      </span>
                      <button
                        onClick={() => handleAddModule(module)}
                        className="bg-blue-600 text-white text-lg px-5 py-2 rounded-lg hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-lg text-gray-500 dark:text-gray-400">
                  No results found. Try a different query.
                </p>
              )}
            </div>
          </div>

          {/* Selected Modules Section */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Selected Modules
            </h3>
            {selectedModules.length === 0 ? (
              <p className="text-lg text-gray-500 dark:text-gray-400">
                No modules selected yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {selectedModules.map((mod) => (
                  <li
                    key={mod}
                    className="flex justify-between items-center bg-gray-200 dark:bg-gray-700 p-3 rounded-lg shadow-md"
                  >
                    <span className="text-lg text-gray-900 dark:text-gray-200">
                      {mod}
                    </span>
                    <button
                      onClick={() => handleRemoveModule(mod)}
                      className="bg-red-500 text-white text-lg px-5 py-2 rounded-lg hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end mt-8 border-t border-gray-200 dark:border-gray-700 pt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 dark:bg-gray-800 text-lg text-gray-900 dark:text-gray-200 px-6 py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleInstall}
            className="bg-blue-600 text-white text-lg px-6 py-3 rounded-lg ml-4 hover:bg-blue-700"
          >
            Install Modules
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoadNpmModuleModal;
