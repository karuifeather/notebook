import { Middleware } from './middleware.ts';
import { ActionType } from '../action-types/index.ts';
import bundle from '../../bundler/index.ts';

export const bundlerMiddleware: Middleware =
  ({ getState, dispatch }) =>
  (next) =>
  (action) => {
    next(action);

    if (action.type !== ActionType.BUNDLE_IT) return;

    const asyncBundle = async () => {
      const result = await bundle(action.payload.rawCode);

      dispatch({
        type: ActionType.BUNDLE_CREATED,
        payload: {
          cellId: action.payload.cellId,
          bundle: result,
        },
      });
    };

    dispatch({
      type: ActionType.BUNDLE_CREATING,
      payload: { cellId: action.payload.cellId },
    });

    asyncBundle();
  };
