import { ActionType } from '../action-types/index.ts';
import { Middleware } from './middleware.ts';

export const updateOrderMiddleware: Middleware =
  ({ getState, dispatch }) =>
  (next) =>
  (action) => {
    // Pass the action to the next middleware/reducer in line
    next(action);

    if (
      action.type === ActionType.DELETE_CELL ||
      action.type === ActionType.INSERT_CELL_AFTER ||
      action.type === ActionType.MOVE_CELL
    ) {
      const state = getState();

      const updatedOrder = state.cells.order;
      console.log(updatedOrder);

      dispatch({
        type: ActionType.UPDATE_CELL_ORDER,
        payload: updatedOrder,
      });
    }
  };
