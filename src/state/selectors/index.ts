import { createSelector } from 'reselect';
import { RootState } from '../store.ts';

export const selectBundleById = (state: RootState, id: string) =>
  state.bundles[id];

export const makeSelectBundleById = () =>
  createSelector(
    [(state: RootState) => state.bundles, (_: RootState, id: string) => id],
    (bundles, id) => {
      // Ensure we return a new reference (or transform the data)
      return { ...bundles[id] };
    }
  );

// Input selectors
const selectOrder = (state: RootState) => state.cells.order;
const selectData = (state: RootState) => state.cells.data;

// Memoized selector
export const selectCells = createSelector(
  [selectOrder, selectData],
  (order, data) => order.map((id) => data[id])
);
