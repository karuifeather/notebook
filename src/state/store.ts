import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { thunk } from 'redux-thunk';
import reducers from './reducers/index.ts';
import { bundlerMiddleware } from './middlewares/bundler-middleware.ts';
import { cumulativeMiddleware } from './middlewares/cumulative-middleware.ts';
import { tempMiddleware } from './middlewares/temp-middleware.ts';

// Persist configuration
const persistConfig = {
  key: 'root', // Root key for the persisted storage
  storage, // Use localStorage as the default storage
  whitelist: ['cells', 'notes', 'notebooks'], // Persist specific reducers
};

// Wrap the root reducer with persistReducer
// @ts-ignore
const persistedReducer = persistReducer(persistConfig, reducers);

// Middlewares
const middlewares = [
  thunk,
  cumulativeMiddleware,
  bundlerMiddleware,
  tempMiddleware,
];

// Configure the store
export const store = configureStore({
  reducer: persistedReducer, // Use the persisted reducer directly
  // @ts-ignore
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'], // Ignore persist actions
      },
    }).concat(middlewares),
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools in only development
});

// Persistor for the store
export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
