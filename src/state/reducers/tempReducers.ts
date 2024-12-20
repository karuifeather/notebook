import { Draft, produce } from 'immer';
import { ActionType } from '../action-types/index.ts';

interface TempState {
  lastCreateId: string;
}

const initialState: TempState = {
  lastCreateId: '',
};

const reducer = (state: TempState = initialState, action: any): TempState => {
  return produce(state, (draft: Draft<TempState>) => {
    switch (action.type) {
      case ActionType.GENERATED_ID:
        draft.lastCreateId = action.payload.id;
        break;
      default:
        return state;
    }
  });
};

export default reducer;
