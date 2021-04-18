import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import * as esbuild from 'esbuild-wasm';

const App = () => {
  const ref = useRef<any>();
  const [rawCode, setRawCode] = useState('');
  const [code, setCode] = useState('');

  const startService = async () => {
    ref.current = await esbuild.initialize({
      //   worker: true,
      wasmURL: '/esbuild.wasm',
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const onClick = () => {
    console.log(ref.current);

    if (!ref.current) return;
    console.log(ref.current);
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
