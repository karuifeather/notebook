import { useRef, useEffect } from 'react';
import './preview.css';

interface PreviewProps {
  code: string;
  error: string;
}

const html = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        body {
          background-color:#eaeaea;
          margin: 0;
          font-family: Arial, sans-serif;
        }
        #root {
          padding: 10px;
        }
      </style>
    </head>
    <body>
      <div id="root"></div>
      <script>
        const handleError = (error) => {
          const root = document.getElementById('root');
          root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + error + '</div>';
          console.error(error);
        };

        window.addEventListener('error', (errorEvent) => {
          errorEvent.preventDefault();
          handleError(errorEvent.error);
        });

        window.addEventListener('message', (event) => {
          try {
            eval(event.data);
          } catch (error) {
            handleError(error);
          }
        }, false);
      </script>
    </body>
  </html>
`;

const Preview: React.FC<PreviewProps> = ({ code, error }) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = html;

      // Wait for the iframe to load before sending the code
      setTimeout(() => {
        iframeRef.current?.contentWindow?.postMessage(code, '*');
      }, 50);
    }
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        title="Preview Output"
        ref={iframeRef}
        srcDoc={html}
        sandbox="allow-scripts"
        style={{
          border: '1px solid #ccc',
          width: '100%',
          height: '100%',
        }}
      />
      {error && (
        <div className="preview-error">
          <h4>Build Error</h4>
          <pre style={{ color: 'red', whiteSpace: 'pre-wrap' }}>{error}</pre>
        </div>
      )}
    </div>
  );
};

export default Preview;
