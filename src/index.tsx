import 'bulmaswatch/darkly/bulmaswatch.min.css';
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';
import CodeEditor from './components/code-editor';
import Preview from './components/preview';

const App = () => {
  const ref = useRef<any>();
  const [rawCode, setRawCode] = useState('');
  const [builtCode, setBuiltCode] = useState('');

  const startService = async () => {
    /**
     * returned object has
     * - transform
     * - build
     * - serve
     * - stop
     */
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: '/esbuild.wasm',
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    if (!ref.current) return;

    /**
     * returned object has
     * - code: String
     * - map: String
     * - warnings: []
     */
    const res = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    });

    setBuiltCode(res.outputFiles[0].text);
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
