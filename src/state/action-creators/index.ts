import { ActionType } from '../action-types/index.ts';
import {
  UpdateCellAction,
  MoveCellAction,
  DeleteCellAction,
  InsertCellAfterAction,
  BundleItAction,
  CreateNoteAction,
  MoveNoteAction,
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
 * Pass noteId and parentId when available so the bundler can use per-note depsLock.
 */
export const bundleIt = (
  cellId: string,
  rawCode: string,
  context?: { noteId: string; parentId: string }
): BundleItAction => {
  return {
    type: ActionType.BUNDLE_IT,
    payload: {
      cellId,
      rawCode,
      noteId: context?.noteId,
      parentId: context?.parentId,
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

export const updateNote = (
  notebookId: string,
  noteId: string,
  note: Partial<Note>
) => ({
  type: ActionType.UPDATE_NOTE,
  payload: { parentId: notebookId, noteId, updates: note },
});

export const moveNote = (
  parentId: string,
  fromIndex: number,
  toIndex: number
): MoveNoteAction => {
  return {
    type: ActionType.MOVE_NOTE,
    payload: {
      parentId,
      fromIndex,
      toIndex,
    },
  };
};

/**
 * Notebook Action Creators
 */
export const createNotebook = (title: string, description: string) => ({
  type: ActionType.CREATE_NOTEBOOK,
  payload: { title, description },
});

/** Create a notebook with an optional fixed id (e.g. 'playground'). */
export const createNotebookWithId = (
  title: string,
  description: string,
  id?: string
) => ({
  type: ActionType.CREATE_NOTEBOOK,
  payload: { title, description, ...(id != null && id !== '' ? { id } : {}) },
});

export const updateNotebook = (
  notebookId: string,
  title: string,
  description: string
) => ({
  type: ActionType.UPDATE_NOTEBOOK,
  payload: { notebookId, title, description },
});

export const updateNotebookCover = (
  notebookId: string,
  coverImage: string | null
) => ({
  type: ActionType.UPDATE_NOTEBOOK_COVER,
  payload: { notebookId, coverImage },
});

export const deleteNotebook = (notebookId: string) => ({
  type: ActionType.DELETE_NOTEBOOK,
  payload: notebookId,
});

export const deleteNote = (notebookId: string, noteId: string) => ({
  type: ActionType.DELETE_NOTE,
  payload: { parentId: notebookId, noteId },
});

/** Merge new pinned versions into a note's depsLock. Persisted via redux-persist. */
export const noteDepsLockMerge = (
  parentId: string,
  noteId: string,
  partialLock: Record<string, string>
) => ({
  type: ActionType.NOTE_DEPS_LOCK_MERGE,
  payload: { parentId, noteId, partialLock },
});

/**
 * Temp Action Creators
 */
