import { ActionType } from '../action-types/index.ts';
import {
  UpdateCellAction,
  MoveCellAction,
  DeleteCellAction,
  InsertCellAfterAction,
  BundleItAction,
} from '../actions/index.ts';
import { CellTypes } from '../types/cell.ts';
import { Note } from '../types/note.ts';

// Update Cell Action
export const updateCell = (
  notebookId: string,
  id: string,
  content: string
): UpdateCellAction => {
  return {
    type: ActionType.UPDATE_CELL,
    payload: {
      notebookId,
      id,
      content,
    },
  };
};

// Delete Cell Action
export const deleteCell = (
  notebookId: string,
  id: string
): DeleteCellAction => {
  return {
    type: ActionType.DELETE_CELL,
    payload: {
      notebookId,
      id,
    },
  };
};

// Move Cell Action
export const moveCell = (
  notebookId: string,
  fromIndex: number,
  toIndex: number
): MoveCellAction => {
  return {
    type: ActionType.MOVE_CELL,
    payload: {
      notebookId,
      fromIndex,
      toIndex,
    },
  };
};

// Insert Cell After Action
export const insertCellAfter = (
  notebookId: string,
  id: string | null,
  cellType: CellTypes,
  content?: string
): InsertCellAfterAction => {
  return {
    type: ActionType.INSERT_CELL_AFTER,
    payload: {
      notebookId,
      id,
      type: cellType,
      content,
    },
  };
};

export const bundleIt = (id: string, content: string): BundleItAction => {
  return {
    type: ActionType.BUNDLE_IT,
    payload: {
      cellId: id,
      rawCode: content,
    },
  };
};

export const addNote = (note: Note) => ({
  type: ActionType.CREATE_NOTE,
  payload: note,
});

export const updateNoteDetails = (
  id: string,
  field: keyof Note,
  value: any
) => {
  return {
    type: ActionType.UPDATE_NOTE_DETAILS,
    payload: { id, field, value },
  };
};

export const removeNote = (noteId: string) => ({
  type: ActionType.DELETE_NOTE,
  payload: { noteId },
});

export const addDependency = (noteId: string, dependency: string) => ({
  type: ActionType.ADD_DEPENDENCY,
  payload: { noteId, dependency },
});

export const removeDependency = (noteId: string, dependency: string) => ({
  type: ActionType.REMOVE_DEPENDENCY,
  payload: { noteId, dependency },
});

export const updateDependencies = (noteId: string, dependencies: string[]) => ({
  type: ActionType.UPDATE_DEPENDENCIES,
  payload: { noteId, dependencies },
});
