import 'bulmaswatch/darkly/bulmaswatch.min.css';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import CodeEditor from './components/code-editor';
import Preview from './components/preview';
import bundle from './bundler';

const App = () => {
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

ReactDOM.render(<App />, document.getElementById('root'));
