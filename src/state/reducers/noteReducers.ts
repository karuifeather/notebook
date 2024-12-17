import { Draft, produce } from 'immer';
import { ActionType } from '../action-types/index.ts';
import { Action } from '../actions/index.ts';
import { Note } from '../types/note.ts';

export interface NotesState {
  // key = NotebookId
  [key: string]: {
    loading: boolean;
    error: string | null;
    order: string[]; // order of note IDs for the notebook
    data: {
      [key: string]: Note; // key = NoteId
    };
  };
}

// Initial State
const initialState: NotesState = {};

// Reducer
const notesReducer = (state = initialState, action: Action): NotesState =>
  produce(state, (draft: Draft<NotesState>) => {
    switch (action.type) {
      // Fetch Notes: Start loading
      case ActionType.FETCH_NOTES: {
        const { parentId } = action.payload;
        if (!draft[parentId]) {
          draft[parentId] = { loading: true, error: null, order: [], data: {} };
        } else {
          draft[parentId].loading = true;
          draft[parentId].error = null;
        }
        break;
      }

      // Fetch Notes: Success
      case ActionType.FETCH_NOTES_SUCCESS: {
        const { parentId, notes } = action.payload;
        draft[parentId] = {
          loading: false,
          error: null,
          order: notes.map((note: Note) => note.id!),
          data: notes.reduce((acc: { [key: string]: Note }, note: Note) => {
            acc[note.id!] = note;
            return acc;
          }, {}),
        };
        break;
      }

      // Fetch Notes: Error
      case ActionType.FETCH_NOTES_ERROR: {
        const { parentId, error } = action.payload;
        if (!draft[parentId]) {
          draft[parentId] = { loading: false, error, order: [], data: {} };
        } else {
          draft[parentId].loading = false;
          draft[parentId].error = error;
        }
        break;
      }

      // Create a new Note
      case ActionType.CREATE_NOTE: {
        const { parentId, note } = action.payload;
        if (!draft[parentId]) {
          draft[parentId] = {
            loading: false,
            error: null,
            order: [],
            data: {},
          };
        }
        draft[parentId].data[note.id!] = note;
        draft[parentId].order.push(note.id!);
        break;
      }

      // Delete a Note
      case ActionType.DELETE_NOTE: {
        const { parentId, noteId } = action.payload;
        if (draft[parentId]?.data[noteId]) {
          delete draft[parentId].data[noteId];
          draft[parentId].order = draft[parentId].order.filter(
            (id) => id !== noteId
          );
        }
        break;
      }

      // Update a Note
      case ActionType.UPDATE_NOTE: {
        const { parentId, noteId, updates } = action.payload;
        if (draft[parentId]?.data[noteId]) {
          Object.assign(draft[parentId].data[noteId], updates);
        }
        break;
      }

      // Move a Note
      case ActionType.MOVE_NOTE: {
        const { parentId, fromIndex, toIndex } = action.payload;
        if (draft[parentId] && draft[parentId].order) {
          const order = draft[parentId].order;

          // Validate indices
          if (
            fromIndex >= 0 &&
            fromIndex < order.length &&
            toIndex >= 0 &&
            toIndex < order.length
          ) {
            // Remove the note at `fromIndex`
            const [movedNote] = order.splice(fromIndex, 1);
            // Insert the note at `toIndex`
            order.splice(toIndex, 0, movedNote);
          }
        }
        break;
      }

      // Add a Dependency to a Note
      case ActionType.ADD_DEPENDENCY: {
        const { parentId, noteId, dependency } = action.payload;
        const note = draft[parentId]?.data[noteId];
        if (note && !note.dependencies.includes(dependency)) {
          note.dependencies.push(dependency);
        }
        break;
      }

      // Remove a Dependency from a Note
      case ActionType.REMOVE_DEPENDENCY: {
        const { parentId, noteId, dependency } = action.payload;
        const note = draft[parentId]?.data[noteId];
        if (note) {
          note.dependencies = note.dependencies.filter(
            (dep) => dep !== dependency
          );
        }
        break;
      }

      // Replace Dependencies for a Note
      case ActionType.UPDATE_DEPENDENCIES: {
        const { parentId, noteId, dependencies } = action.payload;
        const note = draft[parentId]?.data[noteId];
        if (note) {
          note.dependencies = dependencies;
        }
        break;
      }

      default:
        break;
    }
  });

export default notesReducer;
