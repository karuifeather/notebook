import { useActions } from '@/hooks/use-actions.ts';
import { useTypedSelector } from '@/hooks/use-typed-selector.ts';
import { selectLastGeneratedId } from '@/state/selectors/index.ts';
import React, { use, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateNotebook: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const { createNotebook } = useActions();
  const lastGenerateId = useTypedSelector(selectLastGeneratedId);

  const handleOnCreate = (title: string, description: string) => {
    createNotebook(title, description);
  };

  useEffect(() => {
    if (lastGenerateId) {
      navigate(`/app/notebook/${lastGenerateId}`);
    }
  }, [lastGenerateId]);

  return (
    <div className="flex items-center justify-center min-h-[80vh]  bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900   p-4">
      {/* Glassmorphism Container */}
      <div className="w-full max-w-2xl p-6 sm:p-10 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg shadow-2xl rounded-2xl text-center border border-gray-300 dark:border-gray-700">
        {/* Header */}
        <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-6">
          🚀 Create Your Notebook
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg mb-8">
          Start fresh with a new notebook. Give it a name and a little detail!
        </p>

        {/* Input Section */}
        <div className="space-y-6">
          {/* Title Input with Floating Label */}
          <div className="relative">
            <input
              id="notebook-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder=" "
              aria-label="Notebook Name"
              className="peer w-full px-4 pt-6 pb-3 text-lg text-gray-900 dark:text-gray-200 bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-700 transition-all outline-none"
            />
            <label
              htmlFor="notebook-title"
              className="absolute top-3 left-4 text-gray-400 dark:text-gray-500 text-sm peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 transition-all duration-200"
            >
              Notebook Name
            </label>
          </div>

          {/* Description Input */}
          <div className="relative">
            <textarea
              id="notebook-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder=" "
              rows={3}
              aria-label="Notebook Description"
              className="peer w-full px-4 pt-6 pb-3 text-lg text-gray-900 dark:text-gray-200 bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-700 resize-none transition-all outline-none"
            ></textarea>
            <label
              htmlFor="notebook-description"
              className="absolute top-3 left-4 text-gray-400 dark:text-gray-500 text-sm peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 transition-all duration-200"
            >
              Description (Optional)
            </label>
          </div>
        </div>

        {/* Call-to-Action */}
        <div className="mt-8">
          <button
            onClick={() => title.trim() && handleOnCreate(title, description)}
            disabled={!title.trim()}
            className={`w-full py-3 text-lg font-semibold rounded-lg transition-transform transform duration-200 focus:ring-4 focus:outline-none ${
              title.trim()
                ? 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            + Create Notebook
          </button>
        </div>

        {/* Footer */}
        <p
          className="mt-6 text-gray-500 dark:text-gray-400 text-sm"
          aria-live="polite"
        >
          Need inspiration? Start with{' '}
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            "Eureka!"
          </span>
          .
        </p>
      </div>
    </div>
  );
};

export default CreateNotebook;