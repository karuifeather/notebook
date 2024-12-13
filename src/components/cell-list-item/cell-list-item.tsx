import './cell-list-item.css';
import { Cell } from '@/state/index.ts';
import CodeCell from '@/components/code-cell/code-cell.tsx';
import TextEditor from '@/components/text-editor/text-editor.tsx';
import ActionBar from '@/components/action-bar/action-bar.tsx';

interface CellListItemProps {
  cell: Cell;
}

const CellListItem: React.FC<CellListItemProps> = ({ cell }) => {
  let child: React.ReactNode;

  if (cell.type === 'code') {
    child = (
      <>
        <div className="action-bar-wrapper">
          <ActionBar id={cell.id} />
        </div>
        <CodeCell cell={cell} />
      </>
    );
  } else {
    child = (
      <>
        <ActionBar id={cell.id} />
        <TextEditor cell={cell} />
      </>
    );
  }

  return <div className="cell-list-item">{child}</div>;
};

export default CellListItem;
