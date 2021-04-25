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
        body {  background-color: #dbdee0;}
      </style>
    </head>
    <body>
      <div id="root"></div>
      <script>
        const handleError = (error) => {
          const root = document.getElementById('root');
          root.innerHTML = '<div style="color: red;"> <h4>Runtime Error</h4>' + error + '</div>';
          throw error;
        }

        window.addEventListener('error', (errorEvent) => {
          errorEvent.preventDefault();
          handleError(errorEvent.error);
        })

        window.addEventListener('message', (e) => {
          try {
            eval(e.data);
          } catch (error) {
            handleError(error);
          }
        }, false);
      </script>
    </body>
  </html>
  `;

const Preview: React.FC<PreviewProps> = ({ code, error }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    iframe.current.srcdoc = html;

    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, '*');
    }, 50);
  }, [code]);

  return (
    <div className='preview-wrapper'>
      <iframe
        title='this is where miracle happens'
        ref={iframe}
        srcDoc={html}
        sandbox='allow-scripts'
      />
      {error && (
        <div className='preview-error'>
          <h4>Build Error</h4>
          {error}
        </div>
      )}
    </div>
  );
};

export default Preview;
