import { useTypedSelector } from '@/hooks/use-typed-selector.ts';
import { selectNotebookById } from '@/state/selectors/index.ts';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface NotebookCoverProps {
  title: string;
  description: string;
  coverImage?: string;
  notes: { id: string; title: string }[];
  onEdit: () => void;
  onAddNote: (title: string) => void;
  onEditNote: (id: string, title: string) => void;
}

const NotebookCover: React.FC<NotebookCoverProps> = ({
  title,
  description,
  coverImage,
  notes,
  onEdit,
  onAddNote,
  onEditNote,
}): any => {
  const { notebookId } = useParams();
  const navigate = useNavigate();

  if (!notebookId) {
    return navigate('/404');
  }

  const {} = useTypedSelector((state) => selectNotebookById(state, notebookId));

  const [imageLoaded, setImageLoaded] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [hoveredNoteId, setHoveredNoteId] = useState<string | null>(null);

  const handleNewNote = () => {
    if (newNoteTitle.trim()) {
      onAddNote(newNoteTitle);
      setNewNoteTitle('');
    }
  };

  return (
    <div className="flex items-start justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900 p-4">
      {/* Main Container */}
      <div className="w-full max-w-4xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-2xl rounded-2xl overflow-hidden transition-transform duration-300">
        {/* Cover Section */}
        <div
          className={`relative h-80 flex items-center justify-center bg-gradient-to-r ${
            coverImage
              ? 'from-blue-500/50 to-purple-500/50'
              : 'from-gray-200/60 to-gray-300/60 dark:from-gray-700 dark:to-gray-800'
          }`}
        >
          {coverImage ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              )}
              <img
                src={coverImage}
                alt="Notebook Cover"
                className={`w-full h-full object-cover transition-opacity duration-1000 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
              />
            </>
          ) : (
            <div className="text-gray-400 dark:text-gray-500 text-4xl">
              <i className="fas fa-image"></i>
            </div>
          )}
          {/* Overlay Edit Button */}
          <button
            onClick={onEdit}
            className="absolute top-4 right-4 bg-white/80 dark:bg-gray-700/80 hover:bg-white/90 dark:hover:bg-gray-600/90 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg font-medium shadow backdrop-blur-md transition"
          >
            Edit Cover
          </button>
        </div>

        {/* Content Section */}
        <div className="p-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-4">
            {title || 'Untitled Notebook'}
          </h1>
          <p
            className={`text-gray-600 dark:text-gray-400 text-lg ${
              !description ? 'italic' : ''
            }`}
          >
            {description || 'Add a description to your notebook...'}
          </p>
        </div>

        {/* Note List */}
        <div className="px-8 pb-8">
          {notes.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p>No notes here yet.</p>
              <div className="mt-4 flex gap-2 items-center justify-center">
                <input
                  type="text"
                  placeholder="Enter a note title..."
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNewNote()}
                  className="p-2 border rounded-md w-64 dark:bg-gray-800 dark:text-gray-200"
                />
                <button
                  onClick={handleNewNote}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                >
                  Start Creating
                </button>
              </div>
            </div>
          ) : (
            <ul className="space-y-4">
              {notes.map((note) => (
                <li
                  key={note.id}
                  className="group flex items-center justify-between p-4 border dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  onMouseEnter={() => setHoveredNoteId(note.id)}
                  onMouseLeave={() => setHoveredNoteId(null)}
                >
                  {/* Editable Title */}
                  {editingNoteId === note.id ? (
                    <input
                      type="text"
                      value={note.title}
                      onChange={(e) => onEditNote(note.id, e.target.value)}
                      onBlur={() => setEditingNoteId(null)}
                      autoFocus
                      className="w-full p-2 border rounded-md dark:bg-gray-800 dark:text-gray-200"
                    />
                  ) : (
                    <span
                      onDoubleClick={() => setEditingNoteId(note.id)}
                      className="text-gray-800 dark:text-gray-200 cursor-pointer"
                    >
                      {note.title}
                    </span>
                  )}
                  {/* Hover New Note Button */}
                  {hoveredNoteId === note.id && (
                    <button
                      onClick={() => setEditingNoteId('')}
                      className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition"
                    >
                      + New Note
                    </button>
                  )}
                </li>
              ))}

              {/* New Note Input */}
              <li className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add a new note..."
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNewNote()}
                  className="p-2 border rounded-md flex-1 dark:bg-gray-800 dark:text-gray-200"
                />
                <button
                  onClick={handleNewNote}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
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