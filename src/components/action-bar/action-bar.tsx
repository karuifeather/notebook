import { useActions } from '@/hooks/use-actions.ts';
import './action-bar.scss';

interface ActionBarProps {
  id: string;
  children: React.ReactNode;
}

const ActionBar: React.FC<ActionBarProps> = ({ id, children }) => {
  const { deleteCell } = useActions();

  return (
    <div
      className="action-bar absolute top-1/2 -left-[1.5rem] -translate-y-1/2 z-10 flex flex-col items-center opacity-0 translate-x-4 
        group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-in-out"
    >
      {/* Drag Button */}
      {children}
      {/* Delete Button */}
      <button onClick={() => deleteCell(id)} aria-label="Delete Cell">
        <i className="fas fa-trash-alt text-2xl" />
      </button>
    </div>
  );
};

export default ActionBar;
