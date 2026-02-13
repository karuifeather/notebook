import React, { useEffect, useRef, useCallback } from 'react';
import { useActions } from '@/hooks/use-actions.ts';
import { CODE_CELL_STARTER } from '@/constants/code-cell.ts';
import {
  defaultCalloutContent,
  defaultImageContent,
  defaultTableContent,
  defaultTasksContent,
  defaultEmbedContent,
} from '@/utils/block-content.ts';
import type { CellTypes } from '@/state/types/cell.ts';
import './styles/block-type-popover.scss';

export type BlockType = CellTypes;

interface BlockTypePopoverProps {
  anchorRef: React.RefObject<HTMLElement | null>;
  open: boolean;
  onClose: () => void;
  noteId: string;
  currentCellId: string | null;
}

const MENU_ITEMS: {
  id: BlockType;
  label: string;
  icon: string;
  shortcut: string;
}[] = [
  { id: 'markdown', label: 'Text', icon: 'A', shortcut: 'T' },
  { id: 'code', label: 'Code', icon: '</>', shortcut: 'C' },
  { id: 'callout', label: 'Callout', icon: '💬', shortcut: '' },
  { id: 'image', label: 'Image', icon: '🖼', shortcut: '' },
  { id: 'table', label: 'Table', icon: '▦', shortcut: '' },
  { id: 'tasks', label: 'Checklist', icon: '☑', shortcut: '' },
  { id: 'embed', label: 'Embed', icon: '🔗', shortcut: '' },
];

function getInitialContent(type: BlockType): string | undefined {
  switch (type) {
    case 'code':
      return CODE_CELL_STARTER;
    case 'callout':
      return JSON.stringify(defaultCalloutContent());
    case 'image':
      return JSON.stringify(defaultImageContent());
    case 'table':
      return JSON.stringify(defaultTableContent());
    case 'tasks':
      return JSON.stringify(defaultTasksContent());
    case 'embed':
      return JSON.stringify(defaultEmbedContent());
    default:
      return undefined;
  }
}

const BlockTypePopover: React.FC<BlockTypePopoverProps> = ({
  anchorRef,
  open,
  onClose,
  noteId,
  currentCellId,
}) => {
  const { insertCellAfter } = useActions();
  const popoverRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = React.useState(0);

  const handleSelect = useCallback(
    (type: BlockType) => {
      const initialContent = getInitialContent(type);
      insertCellAfter(noteId, currentCellId, type, initialContent);
      onClose();
    },
    [insertCellAfter, noteId, currentCellId, onClose]
  );

  // Keyboard: arrow keys + Enter
  useEffect(() => {
    if (!open || !popoverRef.current) return;
    const el = popoverRef.current;
    const items = el.querySelectorAll<HTMLButtonElement>(
      '[data-block-type-item]'
    );
    const len = items.length;
    if (len === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        e.preventDefault();
        return;
      }
      if (e.key === 'ArrowDown') {
        setFocusedIndex((i) => (i + 1) % len);
        e.preventDefault();
        return;
      }
      if (e.key === 'ArrowUp') {
        setFocusedIndex((i) => (i - 1 + len) % len);
        e.preventDefault();
        return;
      }
      if (e.key === 'Enter') {
        const item = MENU_ITEMS[focusedIndex];
        if (item) handleSelect(item.id);
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    items[focusedIndex]?.focus();
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, focusedIndex, onClose, handleSelect]);

  // Reset focus index when opening
  useEffect(() => {
    if (open) setFocusedIndex(0);
  }, [open]);

  // Click outside to close
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      const anchor = anchorRef.current;
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        anchor &&
        !anchor.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  const anchor = anchorRef.current;
  const anchorRect = anchor?.getBoundingClientRect();
  const style: React.CSSProperties = anchorRect
    ? {
        position: 'fixed',
        top: anchorRect.bottom + 6,
        left: anchorRect.left,
        zIndex: 100,
      }
    : {};

  return (
    <div
      ref={popoverRef}
      className="block-type-popover"
      style={style}
      role="menu"
      aria-label="Add block type"
    >
      {MENU_ITEMS.map((item, i) => (
        <button
          key={item.id}
          type="button"
          role="menuitem"
          data-block-type-item
          tabIndex={i === focusedIndex ? 0 : -1}
          className="block-type-popover__item"
          onClick={() => handleSelect(item.id)}
        >
          <span className="block-type-popover__icon" aria-hidden>
            {item.icon}
          </span>
          <span className="block-type-popover__label">{item.label}</span>
          <span className="block-type-popover__shortcut">{item.shortcut}</span>
        </button>
      ))}
    </div>
  );
};

export default BlockTypePopover;
