import { useRef, useEffect } from 'react';

interface PreviewProps {
  code: string;
}

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

const Preview: React.FC<PreviewProps> = ({ code }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    iframe.current.srcdoc = html;
    iframe.current.contentWindow.postMessage(code, '*');
  }, [code]);

  return (
    <iframe
      title='this is where miracle happens'
      ref={iframe}
      srcDoc={html}
      sandbox='allow-scripts'
    />
  );
};

export default Preview;
