import { Draft, produce } from 'immer';
import { ActionType } from '../action-types/index.ts';
import { Action } from '../actions/index.ts';

export interface NotebookState {
  loading: boolean;
  error: string | null;
  data: { [key: string]: Notebook };
}

export interface Notebook {
  id: string;
  name: string;
  description: string;
  notes: string[];
}

const initialState: NotebookState = {
  loading: false,
  error: null,
  data: {},
};

const reducer = (
  state: NotebookState = initialState,
  action: Action
): NotebookState => {
  return produce(state, (draft: Draft<NotebookState>) => {
    switch (action.type) {
      case ActionType.FETCH_NOTEBOOKS:
        draft.loading = true;
        draft.error = null;
        return;

      case ActionType.FETCH_NOTEBOOKS_SUCCESS:
        draft.loading = false;
        draft.error = null;
        draft.data = action.payload;
        return;

      case ActionType.FETCH_NOTEBOOKS_ERROR:
        draft.loading = false;
        draft.error = action.payload;
        return;

      case ActionType.CREATE_NOTEBOOK:
        const { id, name, description } = action.payload;
        draft.data[id] = { id, name, description, notes: [] };
        return;

      case ActionType.DELETE_NOTEBOOK:
        delete draft.data[action.payload];
        return;

      case ActionType.UPDATE_NOTEBOOK:
        const { notebookId, name: newName } = action.payload;
        if (draft.data[notebookId]) {
          draft.data[notebookId].name = newName;
        }
        return;

      default:
        return;
    }
  });
};

export default reducer;
