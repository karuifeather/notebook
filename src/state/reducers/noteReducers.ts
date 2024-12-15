import { ActionType } from '../action-types/index.ts';
import { Note } from '../types/note.ts';

export interface NotesState {
  loading: boolean;
  error: string | null;
  data: {
    [key: string]: Note; // Notes by ID
  };
}

// Initial State
const initialState: NotesState = {
  loading: false,
  error: null,
  data: {},
};

const randomId = (): string => Math.random().toString(36).substring(2, 7);

// Reducer
const notesReducer = (state = initialState, action: any): NotesState => {
  switch (action.type) {
    // Add a new note
    case ActionType.ADD_NOTE: {
      const note = action.payload;
      note.id = randomId();
      return {
        ...state,
        data: {
          ...state.data,
          [note.id]: note,
        },
      };
    }

    // Remove a note
    case ActionType.REMOVE_NOTE: {
      const { noteId } = action.payload;

      // Create a shallow copy of the state excluding the note
      const { [noteId]: _, ...remainingNotes } = state.data;

      return {
        ...state,
        data: remainingNotes,
      };
    }

    // Add a dependency to a note
    case ActionType.ADD_DEPENDENCY: {
      const { noteId, dependency } = action.payload;

      if (state.data[noteId]?.dependencies.includes(dependency)) {
        return state; // No changes if dependency already exists
      }

      return {
        ...state,
        data: {
          ...state.data,
          [noteId]: {
            ...state.data[noteId],
            dependencies: [...state.data[noteId].dependencies, dependency],
          },
        },
      };
    }

    // Remove a dependency from a note
    case ActionType.REMOVE_DEPENDENCY: {
      const { noteId, dependency } = action.payload;

      return {
        ...state,
        data: {
          ...state.data,
          [noteId]: {
            ...state.data[noteId],
            dependencies: state.data[noteId].dependencies.filter(
              (dep) => dep !== dependency
            ),
          },
        },
      };
    }

    // Replace all dependencies for a note
    case ActionType.UPDATE_DEPENDENCIES: {
      const { noteId, dependencies } = action.payload;

      return {
        ...state,
        data: {
          ...state.data,
          [noteId]: {
            ...state.data[noteId],
            dependencies,
          },
        },
      };
    }

    default:
      return state;
  }
};

export default notesReducer;
