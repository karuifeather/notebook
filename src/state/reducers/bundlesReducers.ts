import { produce, Draft } from 'immer';

import { ActionType } from '../action-types/index.ts';
import { Action } from '../actions/index.ts';

interface BundlesState {
  [key: string]:
    | {
        code: string;
        error: string;
        loading: boolean;
      }
    | undefined;
}

const initialState: BundlesState = {};

const reducer = (
  state: BundlesState = initialState,
  action: Action
): BundlesState => {
  return produce(state, (draft: Draft<BundlesState>) => {
    switch (action.type) {
      case ActionType.BUNDLE_CREATING:
        draft[action.payload.cellId] = {
          loading: true,
          code: '',
          error: '',
        };
        return draft;

      case ActionType.BUNDLE_CREATED:
        draft[action.payload.cellId] = {
          ...action.payload.bundle,
          loading: false,
        };
        return draft;

      default:
        return draft;
    }
  });
};

export default reducer;
