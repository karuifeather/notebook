import { insertCellAfter } from '@/state/action-creators/index.ts';
import { store } from '@/state/store.ts';
import { useEffect, useState } from 'react';
import CellList from '../cell-list/cell-list.tsx';
import LoadNpmModuleModal from '../load-npm/load-npm.tsx';
import { useActions } from '@/hooks/use-actions.ts';
import { Cell } from '@/state/index.ts';
import { Note } from '@/state/index.ts';
import { Sidebar } from '../sidebar/sidebar.tsx';

const sampleNote: Note = {
  title: 'Welcome to Notes',
  description:
    'Hit the + button to create a new cell. Start typing in the editor below to see how it works!',
  order: [],
  dependencies: [],
};

const cells: Cell[] = [
  {
    id: '1',
    type: 'code',
    content: `function greetUser(name) {\n  return \`Welcome, \${name}!\`;\n}\nconsole.log(greetUser('Unfeathered User'));`,
  },
  {
    id: '2',
    type: 'text',
    content: `# Welcome to Unfeathered Notes! 🚀\n\n### Key Features:\n- **Rich Text Editing**\n- **Code Blocks**\n- **Dynamic Cells**\n\nLet's dive in! 👇`,
  },
];

export const NoteComponent = () => {
  const { addNote } = useActions();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true); // Sidebar visibility toggle
  const [notes, setNotes] = useState<Note[]>([]);

  const handleCreateNote = () => {
    const newNote: Note = {
      title: `A new beginning`,
      description: 'Start typing here...',
      order: [],
      dependencies: [],
    };
    setNotes([...notes, newNote]);
  };

  const handleNoteSelect = (id: string) => {
    console.log('Selected Note ID:', id);
  };

  useEffect(() => {
    addNote(sampleNote);

    const initializeCells = () => {
      cells.forEach((cell, index) => {
        const nextCellId =
          index < cells.length - 1 ? cells[index + 1].id : null;
        store.dispatch(insertCellAfter(nextCellId, cell.type, cell.content));
      });
    };

    initializeCells();
  }, []);

  return (
    <div className="relative flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar Toggle for Mobile */}
      <button
        className="absolute top-4 left-4 block lg:hidden bg-blue-500 text-white px-3 py-2 rounded-lg"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      {/* Sidebar */}

      <Sidebar
        notes={[sampleNote]}
        onCreateNote={handleCreateNote}
        onNoteSelect={handleNoteSelect}
      />

      {/* Main Content */}
      <div className="flex-1 px-4 py-6 lg:px-18">
        <div className="mx-auto w-full max-w-6xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
                {sampleNote.title}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mt-1">
                {sampleNote.description}
              </p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700"
            >
              <i className="fas fa-cog text-lg"></i>
            </button>
          </div>

          {/* Cells */}
          <CellList />
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
