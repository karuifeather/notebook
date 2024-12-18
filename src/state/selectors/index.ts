import { createSelector } from 'reselect';
import { RootState } from '../store.ts';

// ----------------------------------
// Base Selectors
// ----------------------------------

export const selectNotebooks = (state: RootState) => state.notebooks.data;

export const selectNotebookById = (state: RootState, notebookId: string) =>
  state.notebooks.data[notebookId] || { title: '', description: '', notes: [] };

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
      }
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
 * Selector to get a bundle by ID
 */
export const makeSelectBundleById = () =>
  createSelector(
    [selectBundles, (_: RootState, id: string) => id],
    (bundles, id) => ({ ...bundles[id] }) // return new reference for safety
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
