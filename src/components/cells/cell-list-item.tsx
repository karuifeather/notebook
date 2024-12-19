import React, { useEffect, useState } from 'react';
import { Cell } from '@/state/index.ts';
import CodeCell from '@/components/cells/code-cell.tsx';
import TextEditor from '@/components/editors/text-editor.tsx';
import './styles/cell-list-item.scss';

interface CellListItemProps {
  cell: Cell;
  noteId: string;
}

const CellListItem: React.FC<CellListItemProps> = ({ cell, noteId }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after the component mounts
    const timeout = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  let child: React.ReactNode;

  if (cell.type === 'code') {
    child = <CodeCell cell={cell} noteId={noteId} />;
  } else if (cell.type === 'markdown') {
    child = <TextEditor cell={cell} />;
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
