import { ActionType } from '../action-types/index.ts';
import { Cell, CellTypes } from '../types/cell.ts';
import { Note, NoteDetails } from '../types/note.ts';

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
interface FetchNotebooksAction {
  type: ActionType.FETCH_NOTEBOOKS;
  payload: null; // No payload
}

interface FetchNotebooksSuccessAction {
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

interface FetchNotebooksErrorAction {
  type: ActionType.FETCH_NOTEBOOKS_ERROR;
  payload: string; // Error message
}

interface CreateNotebookAction {
  type: ActionType.CREATE_NOTEBOOK;
  payload: { name: string; description: string; id: string };
}

interface DeleteNotebookAction {
  type: ActionType.DELETE_NOTEBOOK;
  payload: string; // Notebook ID to delete
}

interface UpdateNotebookAction {
  type: ActionType.UPDATE_NOTEBOOK;
  payload: { notebookId: string; name: string };
}

/**
 * Note actions
 */

export interface FetchNotesAction {
  type: ActionType.FETCH_NOTES;
  payload: string; // Notebook ID
}

export interface FetchNotesSuccessAction {
  type: ActionType.FETCH_NOTES_SUCCESS;
  payload: {
    [key: string]: NoteDetails;
  }; // Payload contains the entire fetched notes structure
}

export interface FetchNotesErrorAction {
  type: ActionType.FETCH_NOTES_ERROR;
  payload: string; // Error message
}

export interface CreateNoteAction {
  type: ActionType.CREATE_NOTE;
  payload: {
    parentId: string; // ID of the parent (NoteDetails level)
    note: Note; // Note to be created
  };
}

export interface DeleteNoteAction {
  type: ActionType.DELETE_NOTE;
  payload: {
    parentId: string; // ID of the parent (NoteDetails level)
    noteId: string; // ID of the note to be deleted
  };
}

export interface UpdateNoteAction {
  type: ActionType.UPDATE_NOTE;
  payload: {
    parentId: string; // ID of the parent (NoteDetails level)
    noteId: string; // ID of the note to be updated
    updates: Partial<Note>; // Partial updates to the note
  };
}

export interface AddDependencyAction {
  type: ActionType.ADD_DEPENDENCY;
  payload: {
    parentId: string; // ID of the parent (NoteDetails level)
    noteId: string; // ID of the note
    dependency: string; // Dependency to add
  };
}

export interface RemoveDependencyAction {
  type: ActionType.REMOVE_DEPENDENCY;
  payload: {
    parentId: string; // ID of the parent (NoteDetails level)
    noteId: string; // ID of the note
    dependency: string; // Dependency to remove
  };
}

export interface UpdateDependenciesAction {
  type: ActionType.UPDATE_DEPENDENCIES;
  payload: {
    parentId: string; // ID of the parent (NoteDetails level)
    noteId: string; // ID of the note
    dependencies: string[]; // New dependencies list
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
