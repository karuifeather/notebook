import React, { Fragment } from 'react';

import { useTypedSelector } from '../hooks/use-typed-selector.ts';
import CellListItem from './cell-list-item.tsx';
import AddCell from './add-cell.tsx';

import './cell-list.css';
import { selectCells } from '@/state/selectors/index.ts';

const CellList: React.FC = () => {
  const cells = useTypedSelector(selectCells);

  const renderedCells = cells.map((cell) => (
    <Fragment key={cell.id}>
      <CellListItem cell={cell} />
      <AddCell prevCellId={cell.id} />
    </Fragment>
  ));

  return (
    <div className="cells-container">
      <AddCell prevCellId={null} forceVisible={cells.length === 0} />
      {renderedCells}
    </div>
  );
};

export default CellList;
