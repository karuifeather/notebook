import { ActionType } from '../action-types/index.ts';
import {
  UpdateCellAction,
  MoveCellAction,
  DeleteCellAction,
  InsertCellAfterAction,
  Direction,
  BundleItAction,
} from '../actions/index.ts';
import { CellTypes } from '../cell.ts';
import { Note } from '../note.ts';

export const updateCell = (id: string, content: string): UpdateCellAction => {
  return {
    type: ActionType.UPDATE_CELL,
    payload: {
      id,
      content,
    },
  };
};

export const deleteCell = (id: string): DeleteCellAction => {
  return {
    type: ActionType.DELETE_CELL,
    payload: id,
  };
};

export const moveCell = (id: string, direction: Direction): MoveCellAction => {
  return {
    type: ActionType.MOVE_CELL,
    payload: {
      id,
      direction,
    },
  };
};

export const insertCellAfter = (
  id: string | null,
  cellType: CellTypes,
  content?: string
): InsertCellAfterAction => {
  return {
    type: ActionType.INSERT_CELL_AFTER,
    payload: {
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
  type: ActionType.ADD_NOTE,
  payload: note,
});

export const removeNote = (noteId: string) => ({
  type: ActionType.REMOVE_NOTE,
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
