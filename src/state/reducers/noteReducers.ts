import { Draft, produce } from 'immer';
import { ActionType } from '../action-types/index.ts';
import { Note } from '../types/note.ts';

export interface NotesState {
  loading: boolean;
  error: string | null;
  order: string[]; // Order of cells by ID
  data: {
    [key: string]: Note; // Notes by ID
  };
}

// Initial State
const initialState: NotesState = {
  loading: false,
  order: [],
  error: null,
  data: {},
};

// Helper function to generate a random ID
const randomId = (): string => Math.random().toString(36).substring(2, 7);

const notesReducer = (state = initialState, action: any): NotesState =>
  produce(state, (draft: Draft<NotesState>) => {
    switch (action.type) {
      // Update the order of cells
      case ActionType.UPDATE_CELL_ORDER: {
        draft.order = action.payload;
        break;
      }

      // Add a new note
      case ActionType.ADD_NOTE: {
        const note: Note = action.payload;
        note.id = randomId();
        draft.data[note.id] = note;
        draft.order.push(note.id);
        break;
      }

      // Remove a note
      case ActionType.REMOVE_NOTE: {
        const { noteId } = action.payload;

        // Remove the note from data and update the order
        delete draft.data[noteId];
        draft.order = draft.order.filter((id) => id !== noteId);
        break;
      }

      // Add a dependency to a note
      case ActionType.ADD_DEPENDENCY: {
        const { noteId, dependency } = action.payload;

        // Add the dependency if it doesn't already exist
        const dependencies = draft.data[noteId]?.dependencies;
        if (dependencies && !dependencies.includes(dependency)) {
          dependencies.push(dependency);
        }
        break;
      }

      // Remove a dependency from a note
      case ActionType.REMOVE_DEPENDENCY: {
        const { noteId, dependency } = action.payload;

        const dependencies = draft.data[noteId]?.dependencies;
        if (dependencies) {
          draft.data[noteId].dependencies = dependencies.filter(
            (dep) => dep !== dependency
          );
        }
        break;
      }

      // Replace all dependencies for a note
      case ActionType.UPDATE_DEPENDENCIES: {
        const { noteId, dependencies } = action.payload;

        if (draft.data[noteId]) {
          draft.data[noteId].dependencies = dependencies;
        }
        break;
      }

      default:
        // For unhandled action types, return the state unchanged
        break;
    }
  });

export default notesReducer;
