import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useActions } from '@/hooks/use-actions.ts';
import { useTypedSelector } from '@/hooks/use-typed-selector.ts';
import {
  selectNotebookById,
  makeSelectNotesByNotebookId,
} from '@/state/selectors/index.ts';
import Block from '../editors/block.tsx';

interface NotebookCoverProps {
  coverImage?: string;
}

const NotebookCover: React.FC<NotebookCoverProps> = ({ coverImage }) => {
  const { notebookId } = useParams();
  const navigate = useNavigate();
  const selectNotesByNotebookId = makeSelectNotesByNotebookId();

  // Local state for notebook title and description
  const [notebookTitle, setNotebookTitle] = useState('');
  const [notebookDesc, setNotebookDesc] = useState('');

  if (!notebookId) {
    navigate('/404');
    return null;
  }

  const [imageLoaded, setImageLoaded] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');

  // Fetch notebook and notes using selectors
  const { description: globalDesc, name: globalTitle } = useTypedSelector(
    (state) => selectNotebookById(state, notebookId)
  );

  const notes = useTypedSelector((state) =>
    selectNotesByNotebookId(state, notebookId)
  );

  const { createNote, updateNotebook } = useActions();

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

  const onEditCover = () => {
    alert('Feature not implemented yet.'); // todo
  };

  useEffect(() => {
    // Initialize local state with global state
    setNotebookTitle(globalTitle || '');
    setNotebookDesc(globalDesc || '');
  }, [globalTitle, globalDesc]); // Run only when the global state changes

  const handleBlur = useCallback(() => {
    // Only call updateNotebook if there are changes
    if (notebookTitle !== globalTitle || notebookDesc !== globalDesc) {
      updateNotebook(
        notebookId,
        notebookTitle ? notebookTitle : 'Untitled Notebook',
        notebookDesc
      );
    }
  }, [
    notebookId,
    notebookTitle,
    notebookDesc,
    globalTitle,
    globalDesc,
    updateNotebook,
  ]);

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
          onClick={onEditCover}
          className="absolute top-4 right-4 bg-white/80 dark:bg-gray-700/80 hover:bg-white/90 dark:hover:bg-gray-600/90 text-gray-700 dark:text-gray-200 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium shadow backdrop-blur-md transition"
        >
          Edit Cover
        </button>
      </div>

      {/* Main Container */}
      <div className="xl:absolute xl:top-1/4 min-h-[80vh]  w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mt-6 sm:mt-8 p-4 sm:p-6 lg:p-8">
        {/* Content Section */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            <Block
              content={notebookTitle}
              handler={setNotebookTitle}
              onBlur={handleBlur}
              variant="heading"
            />
          </h1>
          <div
            className={`text-gray-600 dark:text-gray-400 text-base sm:text-lg ${
              !notebookDesc ? 'italic' : ''
            }`}
          >
            <Block
              content={notebookDesc}
              handler={setNotebookDesc}
              onBlur={handleBlur}
              variant="description"
            />
          </div>
        </div>

        {/* Notes Section */}
        <>
          {notes.length === 0 ? (
            <div className="flex flex-col items-center text-center text-gray-500 dark:text-gray-400">
              {/* Empty State Message */}
              <p className="text-lg font-medium">No notes here yet.</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Start by creating your first note.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 items-center justify-center">
                {/* Input for New Note */}
                <input
                  type="text"
                  placeholder="Enter a note title..."
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNewNote()}
                  className="p-3 w-full sm:w-64 border rounded-md text-lg text-gray-900 dark:text-gray-200 bg-transparent border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                />
                {/* Create Note Button */}
                <button
                  onClick={handleNewNote}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                >
                  Start Creating
                </button>
              </div>
            </div>
          ) : (
            <ul className="space-y-4">
              {/* Notes List */}
              {notes.map((note) => (
                <Link
                  to={`/app/notebook/${notebookId}/note/${note.id}`}
                  key={note.id}
                >
                  <li className="group flex items-center justify-between p-4 border dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition shadow-sm hover:shadow-md">
                    {/* Note Title */}
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
                  className="p-3 flex-1 border rounded-md text-lg text-gray-900 dark:text-gray-200 bg-transparent border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                />
                <button
                  onClick={handleNewNote}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                >
                  Add
                </button>
              </li>
            </ul>
          )}
        </>
      </div>
    </div>
  );
};

export default NotebookCover;
