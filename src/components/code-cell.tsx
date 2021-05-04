import React from 'react';

import { useActions } from '../hooks/use-actions';
import { useTypedSelector } from '../hooks/use-typed-selector';
import CodeEditor from './code-editor';
import Preview from './preview';
import Resizable from './resizable';
import { Cell } from '../state';

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell } = useActions();
  const bundle = useTypedSelector(({ bundles }) => bundles[cell.id]) || {};

  return (
    <Resizable direction='y'>
      <div
        style={{
          display: 'flex',
          height: 'calc(100% - 10px)',
          width: '100%',
        }}
      >
        <Resizable direction='x'>
          <CodeEditor
            defaultValue={cell.content || '//type your code here'}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        <Preview code={bundle.code} error={bundle.error} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
