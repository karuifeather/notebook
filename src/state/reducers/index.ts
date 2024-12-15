import { combineReducers } from 'redux';

import cellsReducer from './cellsReducers.ts';
import bundlesReducer from './bundlesReducers.ts';
import notesReducer from './noteReducers.ts';

const reducers = combineReducers({
  cells: cellsReducer,
  bundles: bundlesReducer,
  notes: notesReducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;
