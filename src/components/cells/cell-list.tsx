import React from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useTypedSelector } from '@/hooks/use-typed-selector.ts';
import { useActions } from '@/hooks/use-actions.ts';
import { makeSelectCells } from '@/state/selectors/index.ts';
import CellListItem from '@/components/cells/cell-list-item.tsx';
import GutterControls from '@/components/cells/GutterControls.tsx';
import AddCell from '@/components/cells/add-cell.tsx';

import './styles/cell-list.scss';

// Sortable Item Component: Notion-style row with left gutter controls
interface SortableItemProps {
  cellId: string;
  noteId: string;
  children: React.ReactNode;
}

const SortableItem: React.FC<SortableItemProps> = ({
  noteId,
  cellId,
  children,
}) => {
  const {
    isDragging,
    isOver,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: cellId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="sortable-item document-layout__block-row group"
      data-dragging={isDragging || undefined}
      data-over={isOver && !isDragging ? 'true' : undefined}
    >
      <div className="document-layout__block-gutter">
        <GutterControls
          noteId={noteId}
          cellId={cellId}
          dragHandleListeners={listeners}
        />
      </div>
      <div className="document-layout__block-content sortable-item__content">
        {children}
      </div>
    </div>
  );
};

const CellList: React.FC<{
  noteId: string;
  notebookId?: string;
}> = ({ noteId, notebookId }) => {
  const selectCells = makeSelectCells();
  const cells = useTypedSelector((state) => selectCells(state, noteId));
  const { moveCell } = useActions();

  // Handle drag end
  const onDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) return; // Prevent errors if dropped outside a valid droppable area

    if (active.id !== over.id) {
      const fromIndex = cells.findIndex((cell) => cell.id === active.id);
      const toIndex = cells.findIndex((cell) => cell.id === over.id);

      // Dispatch the action to reorder cells
      moveCell(noteId, fromIndex, toIndex);
    }
  };

  if (!cells.length) {
    return (
      <div className="document-layout__empty-row">
        <div className="document-layout__empty-gutter" aria-hidden="true" />
        <div className="document-layout__empty-content">
          <AddCell currentCellId={null} noteId={noteId} />
        </div>
      </div>
    );
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext
        items={cells.map((cell) => cell.id)}
        strategy={verticalListSortingStrategy}
      >
        {cells.map((cell) => (
          <SortableItem key={cell.id} cellId={cell.id} noteId={noteId}>
            <CellListItem cell={cell} noteId={noteId} notebookId={notebookId} />
          </SortableItem>
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default CellList;
