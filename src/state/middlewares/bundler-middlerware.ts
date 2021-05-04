import { Middleware } from './middleware';
import { ActionType } from '../action-types';
import bundle from '../../bundler';

let timer: NodeJS.Timeout;
export const bundlerMiddleware: Middleware = ({ getState, dispatch }) => (
  next
) => (action) => {
  next(action);

  if (action.type !== ActionType.UPDATE_CELL) return;

  const {
    cells: { data: cellData },
  } = getState();
  const cell = cellData[action.payload.id];

  if (cell.type === 'text') return;

  clearTimeout(timer);
  timer = setTimeout(async () => {
    console.log('bundle_start');
    const result = await bundle(action.payload.content);
    console.log('bundle_created');

    dispatch({
      type: ActionType.BUNDLE_CREATED,
      payload: {
        cellId: cell.id,
        bundle: result,
      },
    });
  }, 1300);
};
