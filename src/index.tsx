import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';

const App = () => {
  const ref = useRef<any>();
  const [rawCode, setRawCode] = useState('');
  const [code, setCode] = useState('');

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
      plugins: [unpkgPathPlugin(rawCode)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    });

    setCode(res.outputFiles[0].text);
  };

  return (
    <>
      <div>
        <div className=''>
          <textarea
            value={rawCode}
            onChange={(e) => setRawCode(e.target.value)}
          ></textarea>
        </div>
        <div onClick={onClick} className=''>
          <button>Submit</button>
        </div>
      </div>
      <pre>{code}</pre>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
