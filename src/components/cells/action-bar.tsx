import { useActions } from '@/hooks/use-actions.ts';
import './styles/action-bar.scss';

interface ActionBarProps {
  id: string;
  children: React.ReactNode;
}

const ActionBar: React.FC<ActionBarProps> = ({ id, children }) => {
  const { deleteCell } = useActions();

  return (
    <div
      className="action-bar absolute -bottom-4 left-1/2 -translate-x-1/2 md:bottom-1/2 md:translate-y-1/2 md:-left-[1.5rem] z-10 flex md:flex-col items-center opacity-0 md:translate-x-4 
        group-hover:opacity-100 group-hover:translate-y-4 md:group-hover:translate-y-1/2 md:group-hover:translate-x-0 transition-all duration-300 ease-in-out"
    >
      {/* Drag Button */}
      {children}

      {/* Delete Button */}
      {/* See styles/action-bar.scss for styling */}
      <button onClick={() => deleteCell(id)} aria-label="Delete Cell">
        <i className="fas fa-trash-alt" />
      </button>
    </div>
  );
};

export default ActionBar;
