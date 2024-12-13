import { Dispatch } from '@reduxjs/toolkit';
import { RootState } from '../reducers/index.ts';
import { Action } from '../actions/index.ts';

// Define a middleware type that's compatible with Redux middleware
export type Middleware = (api: {
  getState: () => RootState;
  dispatch: Dispatch<Action>;
}) => (next: (action: Action) => void) => (action: Action) => void;
