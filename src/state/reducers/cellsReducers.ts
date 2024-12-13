import { produce, Draft } from 'immer';
import { ActionType } from '../action-types/index.ts';
import { Action } from '../actions/index.ts';
import { Cell } from '../cell.ts';

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
          content: '',
          type: action.payload.type,
          id: randomId(),
        };

        draft.data[cell.id] = cell;

        const foundIndex = draft.order.findIndex(
          (orderId) => orderId === action.payload.id
        );

        if (foundIndex < 0) {
          draft.order.unshift(cell.id);
        } else {
          draft.order.splice(foundIndex + 1, 0, cell.id);
        }
        return;
      }

      case ActionType.MOVE_CELL: {
        const { id, direction } = action.payload;
        const index = draft.order.findIndex((orderId) => orderId === id);
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (index < 0 || targetIndex < 0 || targetIndex >= draft.order.length) {
          return;
        }

        // Swap positions
        [draft.order[index], draft.order[targetIndex]] = [
          draft.order[targetIndex],
          draft.order[index],
        ];
        return;
      }

      default:
        return;
    }
  });
};

const randomId = (): string => Math.random().toString(36).substring(2, 7);

export default reducer;
