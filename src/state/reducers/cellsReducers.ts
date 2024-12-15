import { produce, Draft } from 'immer';
import { ActionType } from '../action-types/index.ts';
import { Action } from '../actions/index.ts';
import { Cell } from '../types/cell.ts';

export interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const reducer = (
  state: CellsState = initialState,
  action: Action
): CellsState => {
  return produce(state, (draft: Draft<CellsState>) => {
    switch (action.type) {
      case ActionType.UPDATE_CELL: {
        const { id, content } = action.payload;
        if (draft.data[id]) {
          draft.data[id].content = content;
        }
        return;
      }

      case ActionType.DELETE_CELL: {
        const id = action.payload;
        if (draft.data[id]) {
          delete draft.data[id];
          draft.order = draft.order.filter((orderId) => orderId !== id);
        }
        return;
      }

      case ActionType.INSERT_CELL_AFTER: {
        const cell: Cell = {
          type: action.payload.type,
          id: randomId(),
          content: action.payload.content || '',
        };

        draft.data[cell.id] = cell;

        const foundIndex = draft.order.findIndex(
          (orderId) => orderId === action.payload.id
        );

        draft.order.splice(foundIndex + 1, 0, cell.id);

        return;
      }

      default:
        return;
    }
  });
};

const randomId = (): string => Math.random().toString(36).substring(2, 7);

export default reducer;
