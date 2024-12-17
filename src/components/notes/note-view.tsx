import { insertCellAfter } from '@/state/action-creators/index.ts';
import { Cell, Note, store } from '@/state/index.ts';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CellList from '../cells/cell-list.tsx';
import LoadNpmModuleModal from './load-npm.tsx';
import { useActions } from '@/hooks/use-actions.ts';
import Block from '../editors/block.tsx';
import { useTypedSelector } from '@/hooks/use-typed-selector.ts';
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

  // TODO: check if Note exists
  if (!noteId) {
    console.error('Note ID not provided');
    return null;
  }

  // const { addNote, updateNoteDetails } = useActions();
  const [isModalOpen, setModalOpen] = useState(false);

  const note = useTypedSelector((state) =>
    selectNoteById(state, notebookId, noteId)
  );

  // @ts-ignore
  const updateNoteDetails = (id, id2, id3) => {};

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

  return (
    <div className="relative flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Main Content */}

      <div className="flex-1 px-4 py-6 lg:px-18">
        <div className="relative mx-auto w-full max-w-6xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-12 sm:py-16">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
            <div className="mb-4 sm:mb-0 w-full">
              <Block
                content={note.title}
                handler={(value) => updateNoteDetails(noteId, 'title', value)}
              />
              <Block
                content={note.description}
                handler={(value) =>
                  updateNoteDetails(noteId, 'description', value)
                }
              />
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700"
            >
              <i className="fas fa-cog text-lg"></i>
            </button>
          </div>

          {/* Cells */}
          <CellList noteId={noteId} />
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
