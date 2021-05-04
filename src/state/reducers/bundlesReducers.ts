import produce, { Draft } from 'immer';
import { ActionType } from '../action-types';
import { Action } from '../actions';

interface BundlesState {
  [key: string]: {
    code: string;
    error: string;
  };
}

const initialState: BundlesState = {};

const reducer = (
  state: BundlesState = initialState,
  action: Action
): BundlesState => {
  return produce(state, (draft: Draft<BundlesState>) => {
    switch (action.type) {
      case ActionType.BUNDLE_CREATED:
        draft[action.payload.cellId] = action.payload.bundle;

        return draft;
      default:
        return draft;
    }
  });
};

export default reducer;
