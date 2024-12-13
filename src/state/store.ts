import { compose, Middleware } from 'redux';
import { thunk } from 'redux-thunk';
import { configureStore } from '@reduxjs/toolkit'; // Preferred over createStore
import reducers from './reducers/index.ts';
import { bundlerMiddleware } from './middlewares/bundler-middleware.ts';
import { cumulativeMiddleware } from './middlewares/cumulative-middleware.ts';

// Type definition for Redux DevTools compose
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

// Define middlewares array
const middlewares: Middleware[] = [
  thunk,
  // @ts-ignore: Ignore type incompatibility for cumulativeMiddleware
  cumulativeMiddleware,
  // @ts-ignore: Ignore type incompatibility for bundlerMiddleware
  bundlerMiddleware,
];

// Configure the store
export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middlewares),
  devTools: process.env.NODE_ENV !== 'production',
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
