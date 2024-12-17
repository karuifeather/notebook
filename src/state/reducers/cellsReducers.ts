import { produce, Draft } from 'immer';
import { ActionType } from '../action-types/index.ts';
import { Action } from '../actions/index.ts';
import { Cell } from '../types/cell.ts';

export interface CellsState {
  // key = noteID
  [key: string]: {
    loading: boolean;
    error: string | null;
    order: string[];
    data: {
      [key: string]: Cell; // key = cellID
    };
  };
}

const initialState: CellsState = {};

const reducer = (
  state: CellsState = initialState,
  action: Action
): CellsState =>
  produce(state, (draft: Draft<CellsState>) => {
    // @ts-ignore
    const { noteId } = action.payload || {}; // Extract the note ID

    switch (action.type) {
      case ActionType.UPDATE_CELL: {
        const { id, content } = action.payload;
        if (draft[noteId] && draft[noteId].data[id]) {
          draft[noteId].data[id].content = content;
        }
        break;
      }

      case ActionType.DELETE_CELL: {
        const { id } = action.payload;
        if (draft[noteId]) {
          delete draft[noteId].data[id];
          draft[noteId].order = draft[noteId].order.filter(
            (orderId) => orderId !== id
          );
        }
        break;
      }

      case ActionType.MOVE_CELL: {
        const { fromIndex, toIndex } = action.payload;

        if (
          draft[noteId] &&
          fromIndex >= 0 &&
          toIndex >= 0 &&
          fromIndex < draft[noteId].order.length &&
          toIndex < draft[noteId].order.length
        ) {
          const [movedCell] = draft[noteId].order.splice(fromIndex, 1);
          draft[noteId].order.splice(toIndex, 0, movedCell);
        }
        break;
      }

      case ActionType.INSERT_CELL_AFTER: {
        const { id, type, content } = action.payload;

        const newCell: Cell = {
          id: randomId(),
          type,
          content: content || '',
        };

        if (draft[noteId]) {
          draft[noteId].data[newCell.id] = newCell;

          const foundIndex = draft[noteId].order.findIndex(
            (orderId) => orderId === id
          );
          if (foundIndex !== -1) {
            draft[noteId].order.splice(foundIndex + 1, 0, newCell.id);
          } else {
            draft[noteId].order.push(newCell.id);
          }
        }
        break;
      }

      case ActionType.FETCH_CELLS: {
        draft[noteId] = {
          loading: true,
          error: null,
          data: {},
          order: [],
        };
        break;
      }

      case ActionType.FETCH_CELLS_SUCCESS: {
        const { data, order } = action.payload;
        draft[noteId] = {
          loading: false,
          error: null,
          data,
          order,
        };
        break;
      }

      case ActionType.FETCH_CELLS_ERROR: {
        draft[noteId] = {
          loading: false,
          error: action.payload.error,
          data: {},
          order: [],
        };
        break;
      }

      default:
        break;
    }
  });

const randomId = (): string => Math.random().toString(36).substring(2, 7);

export default reducer;
