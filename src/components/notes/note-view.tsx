import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTypedSelector } from '@/hooks/use-typed-selector.ts';
import { insertCellAfter } from '@/state/action-creators/index.ts';
import { Cell, store } from '@/state/index.ts';
import CellList from '../cells/cell-list.tsx';
import LoadNpmModuleModal from './load-npm.tsx';
import Block from '../editors/block.tsx';
import { makeSelectNoteById } from '@/state/selectors/index.ts';

const cells: Cell[] = [
  {
    id: '2',
    type: 'markdown',
    content: `# Welcome to Unfeathered Notes! 🚀\n\n### Key Features:\n- **Rich Text Editing**\n- **Code Blocks**\n- **Dynamic Cells**\n\nLet's dive in! 👇`,
  },
  {
    id: '1',
    type: 'code',
    content: `function greetUser(name) {\n  return \`Welcome, \${name}!\`;\n}\nconsole.log(greetUser('Unfeathered User'));`,
  },
];

const NoteView: React.FC = () => {
  const { notebookId, noteId } = useParams();
  const navigate = useNavigate();

  if (!notebookId || !noteId) {
    navigate('/404');
    return null;
  }

  const selectNoteById = makeSelectNoteById();
  const [isModalOpen, setModalOpen] = useState(false);

  const note = useTypedSelector((state) =>
    selectNoteById(state, notebookId, noteId)
  );

  useEffect(() => {
    const initializeCells = () => {
      cells.forEach((cell) => {
        store.dispatch(
          insertCellAfter(noteId, cell.id, cell.type, cell.content)
        );
      });
    };
    initializeCells();
  }, []);

  const updateNoteDetails = (id: string, field: string, value: string) => {
    console.log(`Updated ${field} for Note ${id}: ${value}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main Content */}
      <div className="flex-1 px-2 py-24 sm:py-6 sm:px-6 lg:px-12">
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
          <div className="relative flex flex-wrap sm:flex-nowrap justify-between items-center p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="w-full sm:w-auto flex-1 space-y-4">
              <Block
                content={note?.title || 'Untitled Note'}
                handler={(value) => updateNoteDetails(noteId, 'title', value)}
                className="text-xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100"
              />
              <Block
                content={note?.description || 'Add a description...'}
                handler={(value) =>
                  updateNoteDetails(noteId, 'description', value)
                }
                className="text-sm sm:text-base text-gray-600 dark:text-gray-400"
              />
            </div>
          </div>

          {/* Cells */}
          <div className="p-3 sm:p-6">
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
