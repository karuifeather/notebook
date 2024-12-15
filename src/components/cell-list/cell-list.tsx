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
import { selectCells } from '@/state/selectors/index.ts';

import CellListItem from '@/components/cell-list-item/cell-list-item.tsx';
import AddCell from '@/components/add-cell/add-cell.tsx';

import './cell-list.scss';
import ActionBar from '../action-bar/action-bar.tsx';

// Sortable Item Component
interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

const SortableItem: React.FC<SortableItemProps> = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="sortable-item group bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md  hover:shadow-lg transition"
    >
      <ActionBar id={id}>
        {/* Insert Cell Button */}
        <AddCell currentCellId={id} />
        {/* Drag Button */}
        <button
          {...listeners} // Attach drag listeners
          {...attributes}
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

const CellList: React.FC = () => {
  const cells = useTypedSelector(selectCells);
  const { moveCell } = useActions();

  // Handle drag end
  const onDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const fromIndex = cells.findIndex((cell) => cell.id === active.id);
      const toIndex = cells.findIndex((cell) => cell.id === over.id);

      moveCell(fromIndex, toIndex);
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext
        items={cells.map((cell) => cell.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="cells-container">
          {cells.map((cell) => (
            <Fragment key={cell.id}>
              <SortableItem id={cell.id}>
                <CellListItem cell={cell} />
              </SortableItem>
            </Fragment>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default CellList;
