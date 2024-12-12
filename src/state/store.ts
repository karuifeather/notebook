import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import reducers from './reducers/index.ts';
import { bundlerMiddleware } from './middlewares/bundler-middleware.ts';
import { cumulativeMiddleware } from './middlewares/cumulative-middleware.ts';

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middlewares = [thunk, cumulativeMiddleware, bundlerMiddleware];

export const store = createStore(
  reducers,
  {},
  composeEnhancers(applyMiddleware(...middlewares))
);
