import { useActions } from '@/hooks/use-actions.ts';

interface ActionBarProps {
  id: string;
}

const ActionBar: React.FC<ActionBarProps> = ({ id }) => {
  const { moveCell, deleteCell } = useActions();

  return (
    <div className="action-bar absolute top-1/3 -left-10 -translate-y-1/2 z-10 flex flex-col items-center space-y-2 invisible group-hover:visible transition-opacity duration-300">
      {/* Move Up Button */}
      <button
        className="flex items-center justify-center w-7 h-7 rounded-full bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 shadow-sm"
        onClick={() => moveCell(id, 'up')}
        aria-label="Move Cell Up"
      >
        <i className="fas fa-chevron-up text-sm" />
      </button>

      {/* Move Down Button */}
      <button
        className="flex items-center justify-center w-7 h-7 rounded-full bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 shadow-sm"
        onClick={() => moveCell(id, 'down')}
        aria-label="Move Cell Down"
      >
        <i className="fas fa-chevron-down text-sm" />
      </button>

      {/* Delete Button */}
      <button
        className="flex items-center justify-center w-7 h-7 rounded-full bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-red-100 dark:hover:bg-red-700 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 shadow-sm"
        onClick={() => deleteCell(id)}
        aria-label="Delete Cell"
      >
        <i className="fas fa-trash-alt text-sm" />
      </button>
    </div>
  );
};

export default ActionBar;
