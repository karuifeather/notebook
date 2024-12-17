import { ActionType } from '../action-types/index.ts';
import { Cell, CellTypes } from '../types/cell.ts';
import { Note } from '../types/note.ts';

/**
 * Temp actions
 */
export interface GeneratedIdAction {
  type: ActionType.GENERATED_ID;
  payload: { id: string };
}

/**
 * Cell actions
 */
export interface FetchCellsAction {
  type: ActionType.FETCH_CELLS;
  payload: { noteId: string }; // Target noteId
}

export interface FetchCellsSuccessAction {
  type: ActionType.FETCH_CELLS_SUCCESS;
  payload: {
    noteId: string; // Target noteId
    data: { [key: string]: Cell }; // Cells data
    order: string[]; // Order of cell IDs
  };
}

export interface FetchCellsErrorAction {
  type: ActionType.FETCH_CELLS_ERROR;
  payload: {
    noteId: string; // Target noteId
    error: string; // Error message
  };
}

export interface UpdateCellAction {
  type: ActionType.UPDATE_CELL;
  payload: {
    noteId: string; // Target noteId
    id: string; // Cell ID
    content: string; // Updated content
  };
}

export interface DeleteCellAction {
  type: ActionType.DELETE_CELL;
  payload: {
    noteId: string; // Target noteId
    id: string; // Cell ID to delete
  };
}

export interface MoveCellAction {
  type: ActionType.MOVE_CELL;
  payload: {
    noteId: string; // Target noteId
    fromIndex: number; // Current position
    toIndex: number; // New position
  };
}

export interface InsertCellAfterAction {
  type: ActionType.INSERT_CELL_AFTER;
  payload: {
    noteId: string; // Target noteId
    id: string | null; // ID of the cell after which to insert (null for beginning)
    type: CellTypes; // Cell type
    content?: string; // Optional initial content
  };
}

export interface UpdateCellOrder {
  type: ActionType.UPDATE_CELL_ORDER;
  payload: string[];
}
/**
 * Bundle actions
 */
export interface BundleCreatedAction {
  type: ActionType.BUNDLE_CREATED;
  payload: {
    cellId: string;
    bundle: {
      code: string;
      error: string;
    };
  };
}

export interface BundleCreatingAction {
  type: ActionType.BUNDLE_CREATING;
  payload: {
    cellId: string;
  };
}

export interface BundleItAction {
  type: ActionType.BUNDLE_IT;
  payload: {
    cellId: string;
    rawCode: string;
  };
}

/**
 * Notebook actions
 */
export interface FetchNotebooksAction {
  type: ActionType.FETCH_NOTEBOOKS;
  payload: null; // No payload
}

export interface FetchNotebooksSuccessAction {
  type: ActionType.FETCH_NOTEBOOKS_SUCCESS;
  payload: {
    [key: string]: {
      id: string;
      name: string;
      description: string;
      notes: string[];
    };
  }; // Payload contains the entire fetched notebooks structure
}

export interface FetchNotebooksErrorAction {
  type: ActionType.FETCH_NOTEBOOKS_ERROR;
  payload: string; // Error message
}

export interface CreateNotebookAction {
  type: ActionType.CREATE_NOTEBOOK;
  payload: { title: string; description: string; id: string };
}

export interface DeleteNotebookAction {
  type: ActionType.DELETE_NOTEBOOK;
  payload: string; // Notebook ID to delete
}

export interface UpdateNotebookAction {
  type: ActionType.UPDATE_NOTEBOOK;
  payload: { notebookId: string; name: string };
}

/**
 * Note actions
 */

// Fetch Notes: Start
export interface FetchNotesAction {
  type: ActionType.FETCH_NOTES;
  payload: {
    parentId: string; // Notebook ID
  };
}

// Fetch Notes: Success
export interface FetchNotesSuccessAction {
  type: ActionType.FETCH_NOTES_SUCCESS;
  payload: {
    parentId: string; // Notebook ID
    notes: Note[]; // Array of notes
  };
}

// Fetch Notes: Error
export interface FetchNotesErrorAction {
  type: ActionType.FETCH_NOTES_ERROR;
  payload: {
    parentId: string; // Notebook ID
    error: string; // Error message
  };
}

// Create a Note
export interface CreateNoteAction {
  type: ActionType.CREATE_NOTE;
  payload: {
    parentId: string; // Notebook ID
    note: Note; // New note object
  };
}

// Delete a Note
export interface DeleteNoteAction {
  type: ActionType.DELETE_NOTE;
  payload: {
    parentId: string; // Notebook ID
    noteId: string; // Note ID to delete
  };
}

// Update a Note
export interface UpdateNoteAction {
  type: ActionType.UPDATE_NOTE;
  payload: {
    parentId: string; // Notebook ID
    noteId: string; // Note ID to update
    updates: Partial<Note>; // Fields to update
  };
}

// Add Dependency
export interface AddDependencyAction {
  type: ActionType.ADD_DEPENDENCY;
  payload: {
    parentId: string; // Notebook ID
    noteId: string; // Note ID
    dependency: string; // Dependency to add
  };
}

// Remove Dependency
export interface RemoveDependencyAction {
  type: ActionType.REMOVE_DEPENDENCY;
  payload: {
    parentId: string; // Notebook ID
    noteId: string; // Note ID
    dependency: string; // Dependency to remove
  };
}

// Replace Dependencies
export interface UpdateDependenciesAction {
  type: ActionType.UPDATE_DEPENDENCIES;
  payload: {
    parentId: string; // Notebook ID
    noteId: string; // Note ID
    dependencies: string[]; // Updated list of dependencies
  };
}

export type Action =
  | GeneratedIdAction
  // Cell Actions
  | FetchCellsAction
  | FetchCellsSuccessAction
  | FetchCellsErrorAction
  | MoveCellAction
  | DeleteCellAction
  | UpdateCellAction
  | UpdateCellOrder
  | InsertCellAfterAction
  // Note Actions
  | BundleItAction
  | BundleCreatingAction
  | BundleCreatedAction
  // Notebook Actions
  | FetchNotebooksAction
  | FetchNotebooksSuccessAction
  | FetchNotebooksErrorAction
  | CreateNotebookAction
  | DeleteNotebookAction
  | UpdateNotebookAction
  // Note Actions
  | FetchNotesAction
  | FetchNotesSuccessAction
  | FetchNotesErrorAction
  | CreateNoteAction
  | DeleteNoteAction
  | UpdateNoteAction
  | AddDependencyAction
  | RemoveDependencyAction
  | UpdateDependenciesAction;
