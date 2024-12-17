import { ActionType } from '../action-types/index.ts';
import {
  UpdateCellAction,
  MoveCellAction,
  DeleteCellAction,
  InsertCellAfterAction,
  BundleItAction,
  CreateNoteAction,
} from '../actions/index.ts';
import { CellTypes } from '../types/cell.ts';
import { Note } from '../types/note.ts';

/**
 * Cell Action Creators
 */
// Update Cell Action
export const updateCell = (
  noteId: string,
  id: string,
  content: string
): UpdateCellAction => {
  return {
    type: ActionType.UPDATE_CELL,
    payload: {
      noteId,
      id,
      content,
    },
  };
};

// Delete Cell Action
export const deleteCell = (noteId: string, id: string): DeleteCellAction => {
  return {
    type: ActionType.DELETE_CELL,
    payload: {
      noteId,
      id,
    },
  };
};

// Move Cell Action
export const moveCell = (
  noteId: string,
  fromIndex: number,
  toIndex: number
): MoveCellAction => {
  return {
    type: ActionType.MOVE_CELL,
    payload: {
      noteId,
      fromIndex,
      toIndex,
    },
  };
};

// Insert Cell After Action
export const insertCellAfter = (
  noteId: string,
  id: string | null,
  cellType: CellTypes,
  content?: string
): InsertCellAfterAction => {
  return {
    type: ActionType.INSERT_CELL_AFTER,
    payload: {
      noteId,
      id,
      type: cellType,
      content,
    },
  };
};

/**
 * Bundles Action Creators
 */
export const bundleIt = (id: string, content: string): BundleItAction => {
  return {
    type: ActionType.BUNDLE_IT,
    payload: {
      cellId: id,
      rawCode: content,
    },
  };
};

/**
 * Note Action Creators
 */
export const createNote = (
  notebookId: string,
  note: Note
): CreateNoteAction => ({
  type: ActionType.CREATE_NOTE,
  payload: { parentId: notebookId, note },
});

/**
 * Notebook Action Creators
 */
export const createNotebook = (title: string, description: string) => ({
  type: ActionType.CREATE_NOTEBOOK,
  payload: { title, description },
});
