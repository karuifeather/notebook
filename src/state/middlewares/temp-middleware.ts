import { Middleware } from './middleware.ts';
import { ActionType } from '../action-types/index.ts';
import { randomId } from '@/utils/randomId.ts';

export const tempMiddleware: Middleware =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    // Skip already processed actions
    // This is to prevent infinite loops
    // @ts-ignore
    if (action.meta?.processed) {
      return next(action);
    }

    if (
      action.type !== ActionType.CREATE_NOTEBOOK &&
      action.type !== ActionType.CREATE_NOTE
    ) {
      return next(action);
    }

    const id = randomId();

    switch (action.type) {
      case ActionType.CREATE_NOTEBOOK:
        dispatch({
          type: action.type,
          payload: {
            ...action.payload,
            id,
          },
          meta: { processed: true }, // Add flag
        });
        break;

      case ActionType.CREATE_NOTE: {
        const note = action.payload.note;
        note.id = id;
        dispatch({
          type: action.type,
          payload: {
            ...action.payload,
            note,
          },
          meta: { processed: true }, // Add flag
        });
        break;
      }
    }

    dispatch({
      type: ActionType.GENERATED_ID,
      payload: { id },
    });
  };
