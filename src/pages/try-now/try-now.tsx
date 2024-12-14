import CellList from '@/components/cell-list/cell-list.tsx';
import { insertCellAfter } from '@/state/action-creators/index.ts';
import { Cell } from '@/state/cell.ts';
import { store } from '@/state/store.ts';
import { useEffect } from 'react';

function generateUniqueId(): string {
  return `cell_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

// Array of predefined cells
const cells: Cell[] = [
  {
    id: generateUniqueId(),
    type: 'code',
    content: `// Example: JavaScript Function\n// Define a function to greet users\nfunction greetUser(name) {\n  return \`Welcome, \${name}!\`;\n}\n\n// Call the function\nconsole.log(greetUser('Unfeathered User'));`,
  },
  {
    id: generateUniqueId(),
    type: 'text',
    content: `# Welcome to Unfeathered Notes! 🚀\n\nExplore the powerful features of this app. Create, edit, and organize your notes effortlessly.\n\n### Key Features:\n- **Rich Text Editing**: Style your text with headings, bold, italics, and more.\n- **Code Blocks**: Write and execute code snippets with syntax highlighting.\n- **Dynamic Cells**: Rearrange, add, or delete cells to suit your workflow.\n\nLet's dive in! 👇`,
  },
];

export default function TryNow() {
  useEffect(() => {
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
    <div className={'min-h-[80vh] container mx-auto flex flex-col py-12'}>
      {/* Main Content */}
      <div className="flex flex-1">
        {/* Main Area */}
        <main className="flex-1 p-8 bg-white dark:bg-gray-900">
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
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow">
            <CellList />
          </div>
        </main>
      </div>
    </div>
  );
}
