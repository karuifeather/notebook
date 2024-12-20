import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTypedSelector } from '@/hooks/use-typed-selector.ts';
import CellList from '../cells/cell-list.tsx';
import LoadNpmModuleModal from './load-npm.tsx';
import Block from '../editors/block.tsx';
import { makeSelectNoteById } from '@/state/selectors/index.ts';
import { useActions } from '@/hooks/use-actions.ts';

interface NoteViewProps {
  playgroundNoteId?: string;
}

const NoteView: React.FC<NoteViewProps> = ({ playgroundNoteId }) => {
  let notebookId, noteId;

  if (playgroundNoteId) {
    notebookId = 'playground';
    noteId = playgroundNoteId;
  } else {
    const { notebookId: nId, noteId: ntId } = useParams();
    notebookId = nId;
    noteId = ntId;
  }

  const navigate = useNavigate();

  if (!notebookId || !noteId) {
    navigate('/404');
    return null;
  }

  const selectNoteById = makeSelectNoteById();
  const [isModalOpen, setModalOpen] = useState(false);

  // Local state for notebook title and description
  const [noteTitle, setNoteTitle] = useState('');
  const [noteDesc, setNoteDesc] = useState('');

  const { title: globalNoteTitle, description: globalNoteDesc } =
    useTypedSelector((state) => selectNoteById(state, notebookId, noteId));

  const { updateNote } = useActions();

  useEffect(() => {
    // Initialize local state with global state
    setNoteTitle(globalNoteTitle || '');
    setNoteDesc(globalNoteDesc || '');
  }, [globalNoteTitle, globalNoteTitle]); // Run only when the global state changes

  const handleBlur = useCallback(() => {
    // Only call updateNotebook if there are changes
    if (noteTitle !== globalNoteTitle || noteDesc !== globalNoteDesc) {
      updateNote(notebookId, noteId, {
        title: noteTitle ? noteTitle : 'Untitled Note',
        description: noteDesc,
      });
    }
  }, [
    noteId,
    noteTitle,
    noteDesc,
    globalNoteTitle,
    globalNoteDesc,
    updateNote,
  ]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Main Content */}
      <div className="flex-1 px-2 py-24 overflow-auto custom-scrollbar  sm:py-6 sm:px-6 lg:px-12">
        <div className="relative sm:px-2 mx-auto w-full max-w-3xl xl:max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-md transition-transform">
          <div className="absolute top-3 right-3 flex items-center gap-2 z-50">
            {/* Add Dependencies Button */}
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center justify-center text-white p-2 rounded-full shadow-md focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-700 transition-transform"
              aria-label="Open Settings"
            >
              <i className="fas fa-cog text-lg"></i>
            </button>
          </div>

          {/* Header */}
          {!playgroundNoteId ? (
            <div className="relative flex flex-wrap sm:flex-nowrap justify-between items-center p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="w-full sm:w-auto flex-1 space-y-4">
                <Block
                  onBlur={handleBlur}
                  content={noteTitle}
                  variant="heading"
                  handler={setNoteTitle}
                />
                <Block
                  onBlur={handleBlur}
                  content={noteDesc}
                  variant="description"
                  handler={setNoteDesc}
                />
              </div>
            </div>
          ) : null}

          {/* Cells */}
          <div className="p-3 sm:p-6 ">
            <CellList noteId={noteId} />
          </div>
        </div>
      </div>

      {/* Modal */}
      <LoadNpmModuleModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default NoteView;
