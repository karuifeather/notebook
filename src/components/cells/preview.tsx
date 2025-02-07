import { useRef, useEffect, useState } from 'react';
import './styles/preview.scss';

interface PreviewProps {
  code: string;
  /** Error from bundler (e.g. syntax/build failure). Shown in preview instead of blank. */
  bundlerError?: string;
  initialError?: string;
  /** Which view to show: preview (iframe) or console (logs). Iframe stays mounted when console so logs keep updating. */
  activeView?: 'preview' | 'console';
}

const html = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <script>
        (function(){var w=console.warn;console.warn=function(){var s=arguments[0]&&String(arguments[0]);if(s&&(s.indexOf('should not be used in production')!==-1||s.indexOf('cdn.tailwindcss.com')!==-1))return;return w.apply(console,arguments);};})();
      </script>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        * {
          margin: 0;
          padding: 0;
          margin-block: 0;
          padding-block: 0;
        }
        html, body {
          height: 100%;
          min-height: 100%;
          background-color: #f9f9f9;
          font-family: Arial, sans-serif;
        }
        #root {
          min-height: 100%;
          white-space: pre-wrap;
          overflow-y: auto;
          color: #333;
        }
        pre {
          margin: 0;
          font-family: 'Courier New', Courier, monospace;
        }
      </style>
    </head>
    <body>
      <div id="root"></div>
      <script>
        const handleError = (error) => {
          const errorMessage = \`
            <div style="
              color: #d32f2f;
              background-color: #ffebee;
              padding: 5px;
              border: 1px solid #f44336;
              border-radius: 8px;
              font-family: Arial, sans-serif;
            ">
<h4 style="
display: inline-block;
font-size: 18px;
color: #b71c1c;
font-weight: bold;
">
Runtime Error
</h4>
<pre style="
white-space: pre-wrap;
word-break: break-word;
font-family: 'Courier New', Courier, monospace;
font-size: 14px;
color: #d32f2f;
">
\${error.message}
</pre>
<pre style="
margin: 0;
white-space: pre-wrap;
word-break: break-word;
font-family: 'Courier New', Courier, monospace;
font-size: 12px;
color: #8e8e8e;
">
\${error.stack || ''}
</pre>
            </div>
          \`;
          document.getElementById('root').innerHTML = errorMessage;

          // Send error to parent
          window.parent.postMessage({ type: 'error', args: [error.message, error.stack] }, '*');
          console.error(error);
        };

        ['log', 'error', 'warn', 'info'].forEach((method) => {
          const original = console[method];
          console[method] = (...args) => {
            original(...args); // Log to the actual console
            window.parent.postMessage({ type: method, args }, '*'); // Send to parent
          };
        });

        window.addEventListener('error', (event) => {
          handleError(event.error);
        });

        window.addEventListener('unhandledrejection', (event) => {
          var err = event.reason;
          if (err && (err.message || err.stack)) handleError(err);
          else handleError(new Error(String(err)));
        });

        window.addEventListener('message', (event) => {
          var code = event.data;
          if (!code || typeof code !== 'string') return;
          var blob = new Blob([code], { type: 'application/javascript' });
          var url = URL.createObjectURL(blob);
          import(url)
            .then(function(m) {
              URL.revokeObjectURL(url);
              if (m.default != null && m.React && m.createRoot) {
                var root = document.getElementById('root');
                m.createRoot(root).render(m.React.createElement(m.default));
              }
            })
            .catch(function(err) {
              URL.revokeObjectURL(url);
              handleError(err);
            });
        }, false);
      </script>
    </body>
  </html>
`;

const Preview: React.FC<PreviewProps> = ({
  code,
  bundlerError = '',
  initialError = '',
  activeView = 'preview',
}) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const codeRef = useRef(code);
  const iframeLoadedRef = useRef(false);
  const [runtimeError, setRuntimeError] = useState(initialError);
  const [logs, setLogs] = useState<string[]>([]);

  codeRef.current = code;

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type) {
        const { type, args } = event.data;

        if (type === 'error') {
          const errText = args.join('\n');
          setRuntimeError(errText);
          setLogs((prev) => [...prev, `ERROR: ${errText}`]);
        } else {
          const formattedArgs = args.map((arg: any) =>
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
          );
          setLogs((prevLogs) => [
            ...prevLogs,
            `${type.toUpperCase()}: ${formattedArgs.join(' ')}`,
          ]);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Clear runtime error when code changes so we don't show stale errors
  useEffect(() => {
    setRuntimeError('');
  }, [code]);

  // Set iframe srcdoc once on mount; onload posts latest code and marks ready
  useEffect(() => {
    if (!iframeRef.current) return;
    const iframe = iframeRef.current;
    iframeLoadedRef.current = false;
    iframe.srcdoc = html;
    iframe.onload = () => {
      iframeLoadedRef.current = true;
      const toSend = codeRef.current?.trim() ?? '';
      if (toSend) iframe.contentWindow?.postMessage(toSend, '*');
    };
  }, []);

  // When code changes: send to iframe immediately if already loaded (so we don't rely on reload)
  useEffect(() => {
    if (!code.trim()) return;
    const iframe = iframeRef.current;
    if (iframe?.contentWindow && iframeLoadedRef.current) {
      iframe.contentWindow.postMessage(code, '*');
    }
  }, [code]);

  const showBundlerError = bundlerError.trim().length > 0;
  const showEmptyState = !code.trim() && !showBundlerError;

  return (
    <div
      ref={containerRef}
      className="preview-container relative flex flex-col bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md min-h-0"
    >
      {/* Iframe: always mounted so logs keep updating; hidden when activeView is console */}
      <div
        className={`relative flex flex-col flex-1 min-w-0 min-h-0 ${
          activeView !== 'preview' ? 'hidden' : ''
        }`}
      >
        {showBundlerError && (
          <div className="absolute inset-0 z-10 flex flex-col bg-gray-50 dark:bg-gray-900 border-l-4 border-amber-500 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between shrink-0 px-4 py-2 bg-amber-500/10 dark:bg-amber-500/20 border-b border-amber-500/30">
              <span className="font-semibold text-amber-800 dark:text-amber-200 text-sm">
                Build error
              </span>
            </div>
            <pre className="flex-1 overflow-y-auto p-4 font-mono text-[13px] leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
              {bundlerError}
            </pre>
          </div>
        )}

        {showEmptyState && (
          <div className="absolute inset-0 z-10 flex items-center justify-center p-4 text-gray-500 dark:text-gray-400 text-sm">
            <p>
              Nothing to run yet. Edit code and it will bundle and run here.
            </p>
          </div>
        )}

        <iframe
          title="Preview Output"
          ref={iframeRef}
          sandbox="allow-scripts"
          className="h-full flex-grow w-full border-none rounded-lg bg-white dark:bg-gray-800 min-h-0"
        />

        {runtimeError && (
          <div className="absolute inset-0 z-10 flex flex-col bg-gray-50 dark:bg-gray-900 border-l-4 border-red-500 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between shrink-0 px-4 py-2 bg-red-500/10 dark:bg-red-500/20 border-b border-red-500/30">
              <span className="font-semibold text-red-800 dark:text-red-200 text-sm">
                Runtime error
              </span>
              <button
                onClick={() => setRuntimeError('')}
                className="text-xs font-medium text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100 px-2 py-1 rounded hover:bg-red-500/20"
              >
                Dismiss
              </button>
            </div>
            <pre className="flex-1 overflow-y-auto p-4 font-mono text-[13px] leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
              {runtimeError}
            </pre>
          </div>
        )}
      </div>

      {/* Console tab: terminal vibe, no header */}
      {activeView === 'console' && (
        <div className="flex flex-col flex-1 min-h-0 rounded-lg overflow-hidden bg-[#0c0e12] border border-gray-700/60 font-mono text-[13px]">
          <div className="flex-1 overflow-y-auto p-3 text-gray-300 leading-relaxed">
            {logs.length === 0 ? (
              <p className="text-gray-500">
                <span className="text-green-500/80 select-none">$</span>{' '}
                <span className="italic">
                  No output yet. Run code and use console.log in the Preview
                  tab.
                </span>
              </p>
            ) : (
              logs.map((log, index) => (
                <div
                  key={index}
                  className="flex gap-2 mb-1 text-gray-300 whitespace-pre-wrap break-words"
                >
                  <span className="text-green-500/90 select-none shrink-0">
                    &gt;
                  </span>
                  <span className="min-w-0">{log}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Preview;
