import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import reducers from './reducers';
import { bundlerMiddleware } from './middlewares/bundler-middleware';
import { cumulativeMiddleware } from './middlewares/cumulative-middleware';

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middlewares = [thunk, cumulativeMiddleware, bundlerMiddleware];

export const store = createStore(
  reducers,
  {},
  composeEnhancers(applyMiddleware(...middlewares))
);
