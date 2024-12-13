import React, { useEffect } from 'react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';

import { useActions } from '../hooks/use-actions.ts';
import { useTypedSelector } from '../hooks/use-typed-selector.ts';
import CodeEditor from './code-editor.tsx';
import Preview from './preview.tsx';
import { Cell } from '../state/index.ts';
import { makeSelectBundleById } from '../state/selectors/index.ts';
import './code-cell.css';

interface CodeCellProps {
  cell: Cell;
}

const selectBundle = makeSelectBundleById();

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell, bundleIt } = useActions();
  const bundle = useTypedSelector((state) => selectBundle(state, cell.id));

  const starterCode = 'print("Hello, World!")';

  useEffect(() => {
    console.log('Bundling', cell.id);
    bundleIt(cell.id, starterCode);
  }, []);

  return (
    <PanelGroup className="code-cell" direction="horizontal">
      {/* First panel for the editor */}
      <Panel>
        <CodeEditor
          defaultValue={cell.content || starterCode}
          onChange={(value) => updateCell(cell.id, value)}
        />
      </Panel>

      <PanelResizeHandle />
      {/* Second panel for the preview */}
      <Panel>
        <div className="progress-wrapper">
          {!bundle || bundle.loading ? (
            <div className="progress-cover">
              <progress className="progress is-small is-primary" max="100">
                Loading
              </progress>
            </div>
          ) : (
            <Preview
              code={bundle.code as string}
              error={bundle.error as string}
            />
          )}
        </div>
      </Panel>
    </PanelGroup>
  );
};

export default CodeCell;
