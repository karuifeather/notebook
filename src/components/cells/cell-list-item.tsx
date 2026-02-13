import React, { useEffect, useState } from 'react';
import { Cell } from '@/state/index.ts';
import CodeCell from '@/components/cells/code-cell.tsx';
import TextEditor from '@/components/editors/text-editor.tsx';
import CalloutBlock from '@/components/cells/blocks/CalloutBlock.tsx';
import ImageBlock from '@/components/cells/blocks/ImageBlock.tsx';
import TableBlock from '@/components/cells/blocks/TableBlock.tsx';
import TasksBlock from '@/components/cells/blocks/TasksBlock.tsx';
import EmbedBlock from '@/components/cells/blocks/EmbedBlock.tsx';
import './styles/cell-list-item.scss';

interface CellListItemProps {
  cell: Cell;
  noteId: string;
  notebookId?: string;
}

const CellListItem: React.FC<CellListItemProps> = ({
  cell,
  noteId,
  notebookId,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after the component mounts
    const timeout = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  let child: React.ReactNode;

  switch (cell.type) {
    case 'code':
      child = <CodeCell cell={cell} noteId={noteId} notebookId={notebookId} />;
      break;
    case 'markdown':
      child = <TextEditor cell={cell} noteId={noteId} />;
      break;
    case 'callout':
      child = <CalloutBlock cell={cell} noteId={noteId} />;
      break;
    case 'image':
      child = <ImageBlock cell={cell} noteId={noteId} />;
      break;
    case 'table':
      child = <TableBlock cell={cell} noteId={noteId} />;
      break;
    case 'tasks':
      child = <TasksBlock cell={cell} noteId={noteId} />;
      break;
    case 'embed':
      child = <EmbedBlock cell={cell} noteId={noteId} />;
      break;
    default:
      child = <TextEditor cell={cell} noteId={noteId} />;
  }

  return (
    <div
      className={`cell-list-item transform transition-all duration-500 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      {child}
    </div>
  );
};

export default CellListItem;
