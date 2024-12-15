import { useState, useEffect } from 'react';
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
      <div className="bg-white min-h-[40rem] flex flex-col justify-between dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl p-8 relative overflow-hidden">
        <div className="">
          {/* Modal Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Add NPM Module
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-red-500 transition duration-200"
            >
              <i className="fas fa-times text-2xl"></i>
            </button>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Search Section */}
            <div>
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search for npm modules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-lg rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-200 p-4 pr-12 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <i className="fas fa-search absolute top-4 right-4 text-gray-400 dark:text-gray-500"></i>
              </div>

              <div className="max-h-64 overflow-y-auto custom-scrollbar">
                {isLoading ? (
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    Loading...
                  </p>
                ) : searchResults.length > 0 ? (
                  <ul className="space-y-3">
                    {searchResults.map((module) => (
                      <li
                        key={module}
                        className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm p-3 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                      >
                        <span className="text-lg text-gray-800 dark:text-gray-200">
                          {module}
                        </span>
                        <button
                          onClick={() => handleAddModule(module)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition"
                        >
                          <i className="fas fa-check"></i> Add
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    No results found.
                  </p>
                )}
              </div>
            </div>

            {/* Selected Modules */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Selected Modules
              </h3>
              {selectedModules.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">
                  No modules selected yet.
                </p>
              ) : (
                <ul className="space-y-3">
                  {selectedModules.map((mod) => (
                    <li
                      key={mod}
                      className="flex justify-between items-center bg-gray-200 dark:bg-gray-700 rounded-lg p-3 shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                      <span className="text-lg text-gray-900 dark:text-gray-200">
                        {mod}
                      </span>
                      <button
                        onClick={() => handleRemoveModule(mod)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition"
                      >
                        <i className="fas fa-trash"></i> Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end mt-8 border-t pt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-5 py-3 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleInstall}
            className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-md transition"
          >
            Install Modules
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoadNpmModuleModal;
