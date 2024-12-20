import { Draft, produce } from 'immer';
import { ActionType } from '../action-types/index.ts';

interface TempState {
  lastCreateId: string;
  playground: {
    created: boolean;
    id: string;
  };
}

const initialState: TempState = {
  lastCreateId: '',
  playground: {
    created: false,
    id: '',
  },
};

const reducer = (state: TempState = initialState, action: any): TempState => {
  return produce(state, (draft: Draft<TempState>) => {
    switch (action.type) {
      case ActionType.GENERATED_ID:
        draft.lastCreateId = action.payload.id;
        break;
      case ActionType.CREATE_PLAYGROUND:
        draft.playground = {
          created: true,
          id: action.payload.playgroundId,
        };
        break;
      default:
        return state;
    }
  });
};

export default reducer;
