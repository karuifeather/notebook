import { Draft, produce } from 'immer';
import { ActionType } from '../action-types/index.ts';
import { NoteDetails } from '../types/note.ts';
import { Action } from '../actions/index.ts';
import { Note } from '../types/note.ts';

export interface NotesState {
  loading: boolean;
  error: string | null;
  data: {
    [key: string]: NoteDetails; // key = notebookId
  };
}

// Initial State
const initialState: NotesState = {
  loading: false,
  error: null,
  data: {},
};

// Reducer
const notesReducer = (state = initialState, action: Action): NotesState =>
  produce(state, (draft: Draft<NotesState>) => {
    switch (action.type) {
      // Fetch Notes: Start loading
      case ActionType.FETCH_NOTES: {
        draft.loading = true;
        draft.error = null;
        break;
      }

      // Fetch Notes: Success
      case ActionType.FETCH_NOTES_SUCCESS: {
        draft.loading = false;
        draft.error = null;
        draft.data = action.payload;
        break;
      }

      // Fetch Notes: Error
      case ActionType.FETCH_NOTES_ERROR: {
        draft.loading = false;
        draft.error = action.payload;
        break;
      }

      // Create a new Note
      case ActionType.CREATE_NOTE: {
        const { parentId, note } = action.payload;

        const noteId = note.id;
        const newNote: Note = { ...note };

        if (!draft.data[parentId]) {
          draft.data[parentId] = { data: {}, lastCreatedNoteId: null };
        }

        draft.data[parentId].data[noteId!] = newNote;
        draft.data[parentId].lastCreatedNoteId = noteId!;
        break;
      }

      // Delete a Note
      case ActionType.DELETE_NOTE: {
        const { parentId, noteId } = action.payload;

        if (draft.data[parentId] && draft.data[parentId].data[noteId]) {
          delete draft.data[parentId].data[noteId];
        }
        break;
      }

      // Update a Note
      case ActionType.UPDATE_NOTE: {
        const { parentId, noteId, updates } = action.payload;

        if (draft.data[parentId]?.data[noteId]) {
          Object.assign(draft.data[parentId].data[noteId], updates);
        }
        break;
      }

      // Add a Dependency to a Note
      case ActionType.ADD_DEPENDENCY: {
        const { parentId, noteId, dependency } = action.payload;

        const note = draft.data[parentId]?.data[noteId];
        if (note && !note.dependencies.includes(dependency)) {
          note.dependencies.push(dependency);
        }
        break;
      }

      // Remove a Dependency from a Note
      case ActionType.REMOVE_DEPENDENCY: {
        const { parentId, noteId, dependency } = action.payload;

        const note = draft.data[parentId]?.data[noteId];
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

        const note = draft.data[parentId]?.data[noteId];
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
