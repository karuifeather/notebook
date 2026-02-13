import { createSelector } from 'reselect';
import { RootState } from '../store.ts';

// ----------------------------------
// Base Selectors
// ----------------------------------

export const selectNotebooks = (state: RootState) => state.notebooks.data;

export const selectNotebookById = (state: RootState, notebookId: string) =>
  state.notebooks.data[notebookId] || { title: '', description: '', notes: [] };

/** Returns true if a notebook with the given ID exists (for 404 handling). */
export const selectNotebookExists = (
  state: RootState,
  notebookId: string
): boolean => !!state.notebooks.data[notebookId];

/** Returns true if a note with the given notebookId and noteId exists (for 404 handling). */
export const selectNoteExists = (
  state: RootState,
  notebookId: string,
  noteId: string
): boolean => !!state.notes[notebookId]?.data?.[noteId];

export const selectNotes = (state: RootState) => state.notes;

export const selectCells = (state: RootState) => state.cells;

export const selectBundles = (state: RootState) => state.bundles;

export const selectLastGeneratedId = (state: RootState) =>
  state.temp.lastCreateId;

// ----------------------------------
// Derived Selectors
// ----------------------------------

/**
 * Selector to get all notes for a specific notebook ID
 */
export const makeSelectNotesByNotebookId = () =>
  createSelector(
    [selectNotes, (_: RootState, notebookId: string) => notebookId],
    (notes, notebookId) =>
      notes[notebookId]?.order.map((id) => notes[notebookId].data[id]) || []
  );

/**
 * Selector to get a specific note by notebookId and noteId
 */
export const makeSelectNoteById = () =>
  createSelector(
    [
      selectNotes,
      (_: RootState, notebookId: string) => notebookId,
      (_: RootState, __: string, noteId: string) => noteId,
    ],
    (notes, notebookId, noteId) =>
      notes[notebookId]?.data[noteId] || {
        title: '',
        description: '',
        dependencies: [],
        depsLock: {},
      }
  );

/**
 * Selector to get a note's depsLock directly from store (for Settings modal).
 * Returns undefined if note or depsLock missing; avoids default-object confusion.
 */
export const makeSelectNoteDepsLock = () =>
  createSelector(
    [
      selectNotes,
      (_: RootState, notebookId: string) => notebookId,
      (_: RootState, __: string, noteId: string) => noteId,
    ],
    (notes, notebookId, noteId) => notes[notebookId]?.data?.[noteId]?.depsLock
  );

/**
 * Selector to get the cell order for a noteId
 */
export const makeSelectCellOrder = () =>
  createSelector(
    [selectCells, (_: RootState, noteId: string) => noteId],
    (cells, noteId) => cells[noteId]?.order || []
  );

/**
 * Selector to get all cells for a specific noteId
 */
export const makeSelectCells = () =>
  createSelector(
    [
      makeSelectCellOrder(),
      selectCells,
      (_: RootState, noteId: string) => noteId,
    ],
    (order, cells, noteId) =>
      order.map((id) => cells[noteId]?.data[id] || { content: '' })
  );

/**
 * Selector to get the first code cell id for a note (for "insert imports" target).
 * Returns null if no code cell exists.
 */
export const makeSelectFirstCodeCellId = () =>
  createSelector(
    [
      makeSelectCellOrder(),
      selectCells,
      (_: RootState, noteId: string) => noteId,
    ],
    (order, cells, noteId) => {
      const data = cells[noteId]?.data;
      if (!data || !order) return null;
      for (const id of order) {
        const cell = data[id];
        if (cell?.type === 'code') return id;
      }
      return null;
    }
  );

/** Default shape when no bundle exists yet (avoids undefined code/error/loading in UI) */
const EMPTY_BUNDLE = {
  loading: false,
  code: '',
  error: '',
};

/**
 * Selector to get a bundle by ID. Returns a safe shape so Preview never sees undefined code/error.
 */
export const makeSelectBundleById = () =>
  createSelector(
    [selectBundles, (_: RootState, id: string) => id],
    (bundles, id) => {
      const b = bundles[id];
      return b
        ? { loading: b.loading, code: b.code ?? '', error: b.error ?? '' }
        : { ...EMPTY_BUNDLE };
    }
  );

/**
 * Selector to get all notebooks with their notes
 */
export const makeSelectNotebooksWithNotes = () =>
  createSelector([selectNotebooks, selectNotes], (notebooks, notes) => {
    return Object.values(notebooks).map((notebook) => {
      const notebookNotes =
        notes[notebook.id]?.order.map(
          (noteId) => notes[notebook.id]?.data[noteId]
        ) || [];

      return {
        ...notebook,
        notes: notebookNotes,
      };
    });
  });
