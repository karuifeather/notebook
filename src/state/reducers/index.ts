import { combineReducers } from 'redux';

import cellsReducer from './cellsReducers.ts';
import bundlesReducer from './bundlesReducers.ts';
import notesReducer from './noteReducers.ts';
import notebooksReducer from './notebookReducers.ts';

const reducers = combineReducers({
  bundles: bundlesReducer,
  cells: cellsReducer,
  notes: notesReducer,
  notebooks: notebooksReducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;
