import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import * as esbuild from 'esbuild-wasm';

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

    const res = await ref.current.transform(rawCode, {
      loader: 'jsx',
      target: 'es2015',
    });
    /**
     * returned object has
     * - code: String
     * - map: String
     * - warnings: []
     */
    setCode(res.code);
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
