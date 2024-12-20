import React, { Fragment } from 'react';
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
import AddCell from '@/components/cells/add-cell.tsx';
import ActionBar from '@/components/cells/action-bar.tsx';

import './styles/cell-list.scss';

// Sortable Item Component
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
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: cellId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1, // Adjust opacity while dragging
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes} // Attach drag attributes to the container
      className="sortable-item group bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition"
    >
      <ActionBar cellId={cellId} noteId={noteId}>
        {/* Insert Cell Button */}
        <AddCell currentCellId={cellId} noteId={noteId} />
        {/* Drag Button */}
        <button
          {...listeners} // Attach drag listeners here
          className="cursor-grab active:cursor-grabbing"
          aria-label="Drag Item"
        >
          <i className="fas fa-grip-vertical"></i>
        </button>
      </ActionBar>

      {/* Cell Content */}
      {children}
    </div>
  );
};

const CellList: React.FC<{ noteId: string }> = ({ noteId }) => {
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

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext
        items={cells.map((cell) => cell.id)} // Ensure this matches the updated order
        strategy={verticalListSortingStrategy}
      >
        {cells.map((cell) => (
          <Fragment key={cell.id}>
            <SortableItem cellId={cell.id} noteId={noteId}>
              <CellListItem cell={cell} noteId={noteId} />
            </SortableItem>
          </Fragment>
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default CellList;
