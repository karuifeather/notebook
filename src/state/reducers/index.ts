import { combineReducers } from 'redux';

import cellsReducer from './cellsReducers.ts';
import bundlesReducer from './bundlesReducers.ts';

const reducers = combineReducers({
  cells: cellsReducer,
  bundles: bundlesReducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;
