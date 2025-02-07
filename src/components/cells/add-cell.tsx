import React, { useRef, useState } from 'react';
import BlockTypePopover from '@/components/cells/BlockTypePopover.tsx';
import './styles/add-cell.scss';

interface AddCellProps {
  currentCellId: string | null;
  noteId: string;
}

/**
 * Empty state: single "Add block" affordance using the same compact popover.
 */
const AddCell: React.FC<AddCellProps> = ({ currentCellId, noteId }) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="add-cell-empty">
      <button
        ref={buttonRef}
        type="button"
        className="add-cell-empty__btn"
        aria-label="Add block"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M7 2v10M2 7h10" />
        </svg>
        <span>Add block</span>
      </button>
      <BlockTypePopover
        anchorRef={buttonRef}
        open={open}
        onClose={() => setOpen(false)}
        noteId={noteId}
        currentCellId={currentCellId}
      />
    </div>
  );
};

export default AddCell;
