import { Middleware } from './middleware.ts';
import { ActionType } from '../action-types/index.ts';
import { Action, UpdateCellAction } from '../actions/index.ts';
import { CellsState } from '../reducers/cellsReducers.ts';

interface _MakeItCumulative<A, C> {
  (action: A, cells: C): string;
}

type MakeItCumulative = _MakeItCumulative<UpdateCellAction, CellsState>;

const makeItCumulative: MakeItCumulative = ({ payload }, cells) => {
  const { noteId, id: cellId, content } = payload;
  const cellMeta = cells[noteId];
  const orderedCells = cellMeta.order.map((id) => cellMeta.data[id]);

  const printDeclaration = `
  import _React from 'react';
  import { createRoot } from 'react-dom/client';

  const rootElement = document.getElementById('root');
  const rootContainers = []; // Store separate React roots for each print call

  const print = (value) => {
    const $$printContainer = document.createElement('div'); // Create a container for each print call
    $$printContainer.style.margin = '.2rem';
    rootElement.appendChild($$printContainer); // Append the container to the #root

    // Check the type of the value being printed
    if (typeof value === 'object') {
      if (value.$$typeof && value.props) {
        // If value is a React element, use React 18+ API to render it
        const reactRoot = createRoot($$printContainer);
        rootContainers.push(reactRoot); // Keep track of the React roots
        reactRoot.render(value);
      } else {
        // Render objects as JSON
        $$printContainer.innerHTML = \`<pre>\${JSON.stringify(value, null, 2)}</pre>\`;
      }
    } else {
      // Render non-object values (e.g., strings, numbers)
      $$printContainer.textContent = value;
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
export const cumulativeMiddleware: Middleware =
  ({ getState, dispatch }) =>
  (next) =>
  (action: Action) => {
    next(action);

    if (action.type !== ActionType.UPDATE_CELL) return;

    const { noteId, id } = action.payload;

    const { cells } = getState();
    const cell = cells[noteId].data[id];

    if (cell.type !== 'code') return;

    clearTimeout(timer);
    timer = setTimeout(async () => {
      const cumulativeCode = makeItCumulative(action, cells);

      dispatch({
        type: ActionType.BUNDLE_IT,
        payload: {
          cellId: cell.id,
          rawCode: cumulativeCode,
        },
      });
    }, 1200);
  };
