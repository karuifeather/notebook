import { Middleware } from './middleware';
import { ActionType } from '../action-types';
import { UpdateCellAction } from '../actions';
import { CellsState } from '../reducers/cellsReducers';

interface _MakeItCumulative<A, C> {
  (action: A, cells: C): string;
}

type MakeItCumulative = _MakeItCumulative<UpdateCellAction, CellsState>;

const makeItCumulative: MakeItCumulative = (
  { payload: { id: cellId, content } },
  cells
) => {
  const { data, order } = cells;
  const orderedCells = order.map((id) => data[id]);

  const printDeclaration = `
          import _React from 'react';
          import _ReactDOM from 'react-dom';
          const root = document.getElementById('root');
          var print = (value) => {
            const $$printOutput = document.createElement('div');
            $$printOutput.style.margin = '1rem';

            if (typeof value === 'object') {
              if (value.$$typeof && value.props) {
                _ReactDOM.render(value, root);
              } else {
                $$printOutput.innerHTML = JSON.stringify(value);
                root.insertAdjacentElement('beforeend', $$printOutput);
              }
                          
            } else {
              $$printOutput.innerHTML = JSON.stringify(value);
              root.insertAdjacentElement('beforeend', $$printOutput);
            }           
          };
        `;

  const printRemoval = 'var print = () => {}';

  const cumulativeCode = [];

  for (let c of orderedCells) {
    if (c.type !== 'code') continue;

    if (c.id === cellId) cumulativeCode.push(printDeclaration);
    else cumulativeCode.push(printRemoval);

    if (c.id === cellId) cumulativeCode.push(content);
    else cumulativeCode.push(c.content);

    if (c.id === cellId) break;
  }

  return cumulativeCode.join('\n');
};

let timer: NodeJS.Timeout;
export const cumulativeMiddleware: Middleware = ({ getState, dispatch }) => (
  next
) => (action) => {
  next(action);

  if (action.type !== ActionType.UPDATE_CELL) return;

  const { cells } = getState();
  const cell = cells.data[action.payload.id];

  if (cell.type !== 'code') return;

  clearTimeout(timer);
  timer = setTimeout(async () => {
    const cumulativeCode = makeItCumulative(action, cells);
    console.log(cumulativeCode);

    dispatch({
      type: ActionType.BUNDLE_IT,
      payload: {
        cellId: cell.id,
        rawCode: cumulativeCode,
      },
    });
  }, 1200);
};
