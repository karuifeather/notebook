import { useActions } from '@/hooks/use-actions.ts';

interface ActionBarProps {
  id: string;
}

const ActionBar: React.FC<ActionBarProps> = ({ id }) => {
  const { moveCell, deleteCell } = useActions();

  return (
    <div className="absolute top-0 -right-0 z-10 flex flex-col  rounded overflow-hidden group">
      {/* Move Up Button */}
      <button
        className="w-8 h-8 flex items-center justify-center bg-teal-400 dark:bg-teal-500 text-white hover:bg-teal-500 dark:hover:bg-teal-600 transition-opacity duration-300 opacity-40 group-hover:opacity-100"
        onClick={() => moveCell(id, 'up')}
        aria-label="Move Cell Up"
      >
        <i className="fas fa-arrow-up" />
      </button>

      {/* Move Down Button */}
      <button
        className="w-8 h-8 flex items-center justify-center bg-amber-400 dark:bg-amber-500 text-white hover:bg-amber-500 dark:hover:bg-amber-600 transition-opacity duration-300 opacity-40 group-hover:opacity-100"
        onClick={() => moveCell(id, 'down')}
        aria-label="Move Cell Down"
      >
        <i className="fas fa-arrow-down" />
      </button>

      {/* Delete Button */}
      <button
        className="w-8 h-8 flex items-center justify-center bg-rose-400 dark:bg-rose-500 text-white hover:bg-rose-500 dark:hover:bg-rose-600 transition-opacity duration-300 opacity-40 group-hover:opacity-100"
        onClick={() => deleteCell(id)}
        aria-label="Delete Cell"
      >
        <i className="fas fa-times" />
      </button>
    </div>
  );
};

export default ActionBar;
