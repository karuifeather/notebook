import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';
import CodeEditor from './components/code-editor';

const App = () => {
  const ref = useRef<any>();
  const iframe = useRef<any>();
  const [rawCode, setRawCode] = useState('');

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

    iframe.current.srcdoc = html;

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

    iframe.current.contentWindow.postMessage(res.outputFiles[0].text, '*');
  };

  const html = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body>
      <div id="root"></div>
      <script>
        window.addEventListener('message', (e) => {
          try {
            eval(e.data)
          } catch (error) {
            const root = document.getElementById('root');
            root.innerHTML = '<div style="color: orangered;"> <h4>Runtime Error</h4>' + error + '</div>';
            throw error;
          }
          eval(e.data);
        }, false);
      </script>
    </body>
  </html>
  `;

  return (
    <>
      <div>
        <div className=''>
          <CodeEditor
            defaultValue='//check this out'
            onChange={(value) => setRawCode(value)}
          />
          <textarea
            value={rawCode}
            onChange={(e) => setRawCode(e.target.value)}
          ></textarea>
        </div>
        <div onClick={onClick} className=''>
          <button>Submit</button>
        </div>
      </div>
      <iframe
        title='this is where miracle happens'
        ref={iframe}
        srcDoc={html}
        sandbox='allow-scripts'
      />
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
