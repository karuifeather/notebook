import React, { useState, useEffect } from 'react';

import { useActions } from '../hooks/use-actions';
import CodeEditor from './code-editor';
import Preview from './preview';
import bundle from '../bundler';
import Resizable from './resizable';
import { Cell } from '../state';

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const [builtCode, setBuiltCode] = useState('');
  const [error, setError] = useState('');
  const { updateCell } = useActions();

  useEffect(() => {
    let timer = setTimeout(async () => {
      const res = await bundle(cell.content);
      setBuiltCode(res.code);
      setError(res.error);
    }, 1300);

    return () => {
      timer && clearTimeout(timer);
    };
  }, [cell.content]);

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
        <Preview code={builtCode} error={error} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
