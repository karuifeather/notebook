import React, { useState } from 'react';

import CodeEditor from './code-editor';
import Preview from './preview';
import bundle from '../bundler';
import Resizable from './resizable';

const CodeCell: React.FC = () => {
  const [rawCode, setRawCode] = useState('');
  const [builtCode, setBuiltCode] = useState('');

  const onClick = async () => {
    const res = await bundle(rawCode);
    setBuiltCode(res);
  };

  return (
    <Resizable direction='y' height={400}>
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
        }}
      >
        <CodeEditor
          defaultValue='//check this out'
          onChange={(value) => setRawCode(value)}
        />

        {/* <button onClick={onClick}>Submit</button> */}
        <Preview code={builtCode} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
