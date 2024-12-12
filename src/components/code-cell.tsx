import React, { useEffect } from 'react';

import './code-cell.css';
import { useActions } from '../hooks/use-actions';
import { useTypedSelector } from '../hooks/use-typed-selector';
import CodeEditor from './code-editor';
import Preview from './preview';
import { Cell } from '../state';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell, bundleIt } = useActions();
  const bundle = useTypedSelector(({ bundles }) => bundles[cell.id]);

  useEffect(() => {
    bundleIt(cell.id, cell.content);
  }, [bundleIt, cell.id, cell.content]);

  return (
    <PanelGroup direction="vertical">
      {/* First panel for the editor */}
      <Panel>
        <PanelGroup direction="horizontal">
          {/* Code editor with horizontal resizing */}
          <Panel>
            <CodeEditor
              defaultValue={cell.content || '//type your code here'}
              onChange={(value) => updateCell(cell.id, value)}
            />
          </Panel>
          <PanelResizeHandle />
        </PanelGroup>
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
            <Preview code={bundle.code} error={bundle.error} />
          )}
        </div>
      </Panel>
    </PanelGroup>
  );
};

export default CodeCell;
