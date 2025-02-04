import React, { useEffect, useRef, useState } from 'react';
import { useActions } from '@/hooks/use-actions.ts';
import BlockTypePopover from '@/components/cells/BlockTypePopover.tsx';
import './styles/gutter-controls.scss';

interface GutterControlsProps {
  noteId: string;
  cellId: string;
  dragHandleListeners: Record<string, () => void> | undefined;
}

const GutterControls: React.FC<GutterControlsProps> = ({
  noteId,
  cellId,
  dragHandleListeners,
}) => {
  const { deleteCell } = useActions();
  const [addOpen, setAddOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  const closeAdd = () => setAddOpen(false);
  const closeMore = () => setMoreOpen(false);

  useEffect(() => {
    if (!moreOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        moreMenuRef.current &&
        !moreMenuRef.current.contains(e.target as Node) &&
        moreButtonRef.current &&
        !moreButtonRef.current.contains(e.target as Node)
      ) {
        closeMore();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [moreOpen]);

  return (
    <div className="gutter-controls">
      <button
        type="button"
        className="gutter-controls__btn gutter-controls__handle"
        aria-label="Drag block"
        {...dragHandleListeners}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="currentColor"
          aria-hidden
        >
          <circle cx="4" cy="3" r="1.2" />
          <circle cx="10" cy="3" r="1.2" />
          <circle cx="4" cy="7" r="1.2" />
          <circle cx="10" cy="7" r="1.2" />
          <circle cx="4" cy="11" r="1.2" />
          <circle cx="10" cy="11" r="1.2" />
        </svg>
      </button>
      <button
        ref={addButtonRef}
        type="button"
        className="gutter-controls__btn"
        aria-label="Add block"
        aria-expanded={addOpen}
        aria-haspopup="menu"
        onClick={() => setAddOpen((v) => !v)}
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
      </button>
      <div className="gutter-controls__more-wrap">
        <button
          ref={moreButtonRef}
          type="button"
          className="gutter-controls__btn"
          aria-label="Block actions"
          aria-expanded={moreOpen}
          aria-haspopup="menu"
          onClick={() => setMoreOpen((v) => !v)}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="currentColor"
            aria-hidden
          >
            <circle cx="7" cy="3" r="1.25" />
            <circle cx="7" cy="7" r="1.25" />
            <circle cx="7" cy="11" r="1.25" />
          </svg>
        </button>
        {moreOpen && (
          <div
            ref={moreMenuRef}
            className="gutter-controls__more-menu"
            role="menu"
          >
            <button
              type="button"
              role="menuitem"
              className="gutter-controls__more-item gutter-controls__more-item--danger"
              onClick={() => {
                deleteCell(noteId, cellId);
                closeMore();
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path d="M2 4h10v8a1 1 0 01-1 1H3a1 1 0 01-1-1V4z" />
                <path d="M5 4V3a1 1 0 011-1h2a1 1 0 011 1v1" />
                <path d="M6 7v3M8 7v3" />
              </svg>
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      <BlockTypePopover
        anchorRef={addButtonRef}
        open={addOpen}
        onClose={closeAdd}
        noteId={noteId}
        currentCellId={cellId}
      />
    </div>
  );
};

export default GutterControls;
