import { createSelector } from 'reselect';
import { RootState } from '../store.ts';

// Base selector to get the notebook state by ID
export const selectNotebookById = (state: RootState, notebookId: string) =>
  state.notebooks.data[notebookId] || { title: '', description: '', notes: [] };

// Selector to get the `data` for a note by notebookId by noteID
export const selectNoteById = (
  state: RootState,
  notebookId: string,
  noteID: string
) =>
  state.notes.data[notebookId].data[noteID] || {
    title: '',
    description: '',
    dependencies: [],
  };

// Selector to get the cell order by noteID
const selectOrder = (state: RootState, noteId: string) =>
  state.cells[noteId].order;

// Memoized selector to get all cells for a notebook
export const selectCells = (state: RootState, noteId: string) => {
  const order = selectOrder(state, noteId);
  return order.map((id) => state.cells[noteId].data[id]);
};

export const selectBundleById = (state: RootState, id: string) =>
  state.bundles[id];

export const makeSelectBundleById = () =>
  createSelector(
    [(state: RootState) => state.bundles, (_: RootState, id: string) => id],
    (bundles, id) => {
      // Ensure we return a new reference (or transform the data)
      return { ...bundles[id] };
    }
  );

export const selectLastCreatedNoteId = (state: RootState, notebookId: string) =>
  state.notes.data[notebookId].lastCreatedNoteId;

// // Input selectors
// const selectCellsOrder = (state: RootState, noteId: string) =>
//   state.cells.order;
// const selectData = (state: RootState) => state.cells.data;
// // const selectNotesData = (state: RootState) => state.notes.data;

// // Memoized selector
// export const selectCells = createSelector(
//   [selectOrder, selectData],
//   (order, data) => order.map((id) => data[id])
// );
