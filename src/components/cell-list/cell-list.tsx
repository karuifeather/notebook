import React, { Fragment } from 'react';

import { useTypedSelector } from '@/hooks/use-typed-selector.ts';
import CellListItem from '@/components/cell-list-item/cell-list-item.tsx';
import AddCell from '@/components/add-cell/add-cell.tsx';
import { selectCells } from '@/state/selectors/index.ts';

import './cell-list.css';

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