import React, { useState } from 'react';

import CodeEditor from './code-editor';
import Preview from './preview';
import bundle from '../bundler';

const CodeCell: React.FC = () => {
  const [rawCode, setRawCode] = useState('');
  const [builtCode, setBuiltCode] = useState('');

  const onClick = async () => {
    const res = await bundle(rawCode);
    setBuiltCode(res);
  };

  return (
    <>
      <CodeEditor
        defaultValue='//check this out'
        onChange={(value) => setRawCode(value)}
      />
      <button onClick={onClick}>Submit</button>
      <Preview code={builtCode} />
    </>
  );
};

export default CodeCell;
