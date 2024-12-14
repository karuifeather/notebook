import { useRef, useEffect, useState } from 'react';

interface PreviewProps {
  code: string;
  initialError?: string;
}

const html = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <!-- Load Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
      <style>
        * {
          margin: 0;
          padding: 0;
          margin-block: 0;
          padding-block: 0;
        }
        body {
          background-color: #f9f9f9;
          margin: 0;
          font-family: Arial, sans-serif;
        }
        #root {
          white-space: pre-wrap;
          overflow-y: auto;
          color: #333;
        }
        pre {
          margin: 0;
          font-family: 'Courier New', Courier, monospace;
        }
        div {
          margin-bottom: 8px;
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

        window.addEventListener('message', (event) => {
          try {
            const result = (function() {
              return eval(event.data);
            })();
            if (result !== undefined) console.log(result);
          } catch (err) {
            handleError(err);
          }
        }, false);
      </script>
    </body>
  </html>
`;

const Preview: React.FC<PreviewProps> = ({ code, initialError = '' }) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [error, setError] = useState(initialError);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type) {
        const { type, args } = event.data;

        if (type === 'error') {
          setError(args.join('\n')); // Capture the error in the `error` state
        } else {
          const formattedArgs = args.map((arg: any) =>
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
          );
          // @ts-ignore
          console[type]?.(...formattedArgs); // Log to actual console
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

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      iframe.srcdoc = html;

      iframe.onload = () => {
        try {
          if (code.trim()) {
            iframe.contentWindow?.postMessage(code, '*');
          } else {
            iframe.contentWindow?.postMessage(
              "console.log('No code provided');",
              '*'
            );
          }
        } catch (err) {
          console.error('Error posting message:', err);
        }
      };
    }
  }, [code]);

  return (
    <div className="relative h-full flex-grow bg-gray-200 rounded border border-gray-300 overflow-hidden">
      <iframe
        title="Preview Output"
        ref={iframeRef}
        sandbox="allow-scripts"
        className="h-full w-full border-none rounded bg-white"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gray-800 text-white text-xs p-2 max-h-40 overflow-y-auto">
        {logs.map((log, index) => (
          <div key={index} className="mb-1">
            {log}
          </div>
        ))}
      </div>
      {error && (
        <div className="absolute inset-0 p-4 bg-red-100 text-red-700 text-sm font-mono rounded shadow overflow-y-auto">
          <h4 className="text-red-800 text-lg font-bold mb-2 flex justify-between">
            <span>Build Error</span>
            <button
              onClick={() => setError('')}
              className="text-xs bg-red-800 text-white px-2 py-1 rounded hover:bg-red-700"
            >
              Dismiss
            </button>
          </h4>
          <pre>{error}</pre>
        </div>
      )}
    </div>
  );
};

export default Preview;
