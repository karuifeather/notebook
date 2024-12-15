import { insertCellAfter } from '@/state/action-creators/index.ts';
import { Cell } from '@/state/cell.ts';
import { store } from '@/state/store.ts';
import { useEffect, useState } from 'react';
import CellList from '../cell-list/cell-list.tsx';
import LoadNpmModuleModal from '../load-npm/load-npm.tsx';
import { useActions } from '@/hooks/use-actions.ts';
import { Note } from '@/state/note.ts';

const sampleNote: Note = {
  title: 'Welcome to Notes',
  description:
    'Hit the + button to create a new cell. Start typing in the editor below to see how it works!',
  order: [],
  dependencies: [],
};

// Array of predefined cells
const cells: Cell[] = [
  {
    id: '1',
    type: 'code',
    content: `// Example: JavaScript Function\n// Define a function to greet users\nfunction greetUser(name) {\n  return \`Welcome, \${name}!\`;\n}\n\n// Call the function\nconsole.log(greetUser('Unfeathered User'));`,
  },
  {
    id: '2',
    type: 'text',
    content: `# Welcome to Unfeathered Notes! 🚀\n\nExplore the powerful features of this app. Create, edit, and organize your notes effortlessly.\n\n### Key Features:\n- **Rich Text Editing**: Style your text with headings, bold, italics, and more.\n- **Code Blocks**: Write and execute code snippets with syntax highlighting.\n- **Dynamic Cells**: Rearrange, add, or delete cells to suit your workflow.\n\nLet's dive in! 👇`,
  },
];

export const NoteComponent = () => {
  const { addNote } = useActions();
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    addNote(sampleNote);

    const initializeCells = () => {
      cells.forEach((cell, index) => {
        const nextCellId =
          index < cells.length - 1 ? cells[index + 1].id : null;
        store.dispatch(insertCellAfter(nextCellId, cell.type, cell.content));
      });
    };

    // Call the function
    initializeCells();
  }, []);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-10 px-4">
      {/* Page Container */}
      <div className="bg-white dark:bg-gray-800 max-w-4xl mx-auto p-8 rounded-xl shadow-lg">
        <div className="p-4">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700"
          >
            <i className="fas fa-box mr-2"></i> Load NPM Module
          </button>
          <LoadNpmModuleModal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
          />
        </div>
        <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow">
          <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 mb-8">
            Welcome to Notes
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Hit the{' '}
            <span className="font-bold text-primary-light dark:text-primary-dark">
              +
            </span>{' '}
            button to create a new cell. Start typing in the editor below to see
            how it works!
          </p>
        </div>
        <CellList />
      </div>
    </div>
  );
};
