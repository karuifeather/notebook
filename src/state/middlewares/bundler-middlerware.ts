import { Middleware } from './middleware';
import { ActionType } from '../action-types';

let timer: NodeJS.Timeout;
export const bundlerMiddleware: Middleware = (store) => (next) => (action) => {
  next(action);

  clearTimeout(timer);

  timer = setTimeout(() => {
    console.log('Hello after .75s of last action pass');
  }, 750);
};
