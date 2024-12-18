import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useActions } from '@/hooks/use-actions.ts';
import { useTypedSelector } from '@/hooks/use-typed-selector.ts';
import {
  selectNotebookById,
  makeSelectNotesByNotebookId,
} from '@/state/selectors/index.ts';

interface NotebookCoverProps {
  coverImage?: string;
}

const NotebookCover: React.FC<NotebookCoverProps> = ({ coverImage }) => {
  const { notebookId } = useParams();
  const navigate = useNavigate();
  const selectNotesByNotebookId = makeSelectNotesByNotebookId();

  if (!notebookId) {
    navigate('/404');
    return null;
  }

  const [imageLoaded, setImageLoaded] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');

  // Fetch notebook and notes using selectors
  const { description, name: title } = useTypedSelector((state) =>
    selectNotebookById(state, notebookId)
  );

  const notes = useTypedSelector((state) =>
    selectNotesByNotebookId(state, notebookId)
  );

  const { createNote } = useActions();

  const handleNewNote = () => {
    if (newNoteTitle.trim()) {
      createNote(notebookId, {
        title: newNoteTitle,
        description: '',
        dependencies: [],
      });
      setNewNoteTitle('');
    }
  };

  const onEdit = () => {
    alert('Feature not implemented yet.');
  };

  return (
    <div className="relative flex flex-col items-center justify-start min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      {/* Cover Section */}
      <div className="relative w-full h-60 sm:h-72 lg:h-80 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
        {coverImage ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            )}
            <img
              src={coverImage}
              alt="Notebook Cover"
              className={`w-full h-full object-cover transition-opacity duration-700 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 text-4xl">
            <i className="fas fa-image"></i>
          </div>
        )}
        {/* Overlay Edit Button */}
        <button
          onClick={onEdit}
          className="absolute top-4 right-4 bg-white/80 dark:bg-gray-700/80 hover:bg-white/90 dark:hover:bg-gray-600/90 text-gray-700 dark:text-gray-200 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium shadow backdrop-blur-md transition"
        >
          Edit Cover
        </button>
      </div>

      {/* Main Container */}
      <div className="xl:absolute xl:top-1/4 min-h-[60vh]  w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mt-6 sm:mt-8 p-4 sm:p-6 lg:p-8">
        {/* Content Section */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            {title || 'Untitled Notebook'}
          </h1>
          <p
            className={`text-gray-600 dark:text-gray-400 text-base sm:text-lg ${
              !description ? 'italic' : ''
            }`}
          >
            {description || 'Add a description to your notebook...'}
          </p>
        </div>

        {/* Notes Section */}
        <div>
          {notes.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p>No notes here yet.</p>
              <div className="mt-4 flex flex-col sm:flex-row gap-3 items-center justify-center">
                <input
                  type="text"
                  placeholder="Enter a note title..."
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNewNote()}
                  className="p-2 w-full sm:w-64 border rounded-md text-lg text-gray-900 dark:text-gray-200 bg-transparent border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <button
                  onClick={handleNewNote}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-md transition"
                >
                  Start Creating
                </button>
              </div>
            </div>
          ) : (
            <ul className="space-y-4">
              {notes.map((note) => (
                <Link
                  to={`/app/notebook/${notebookId}/note/${note.id}`}
                  key={note.id}
                >
                  <li className="group flex items-center justify-between p-4 border dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    <span className="text-gray-800 dark:text-gray-200">
                      {note.title}
                    </span>
                  </li>
                </Link>
              ))}
              {/* New Note Input */}
              <li className="flex flex-col sm:flex-row gap-3 items-center">
                <input
                  type="text"
                  placeholder="Add a new note..."
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNewNote()}
                  className="p-2 flex-1 border rounded-md text-lg text-gray-900 dark:text-gray-200 bg-transparent border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <button
                  onClick={handleNewNote}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-md transition"
                >
                  Add
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotebookCover;