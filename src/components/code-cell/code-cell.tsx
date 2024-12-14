import React, { useCallback, useEffect } from 'react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';

import { useActions } from '@/hooks/use-actions.ts';
import { useTypedSelector } from '@/hooks/use-typed-selector.ts';
import CodeEditor from '@/components/code-editor/code-editor.tsx';
import Preview from '@/components/preview/preview.tsx';
import { Cell } from '@/state/index.ts';
import { makeSelectBundleById } from '@/state/selectors/index.ts';
import './code-cell.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripLinesVertical } from '@fortawesome/free-solid-svg-icons';

interface CodeCellProps {
  cell: Cell;
}

const selectBundle = makeSelectBundleById();

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell, bundleIt } = useActions();
  const bundle = useTypedSelector((state) => selectBundle(state, cell.id));

  const starterCode = 'print("Hello, World!")';

  // Initialize the bundle with starter code on mount
  useEffect(() => {
    bundleIt(cell.id, starterCode);
  }, []);

  const handleEditorChange = useCallback(
    (value: string) => {
      updateCell(cell.id, value);
    },
    [updateCell, cell.id]
  );

  return (
    <div className="resizable-code-cell">
      <PanelGroup className="code-cell" direction="horizontal">
        {/* First panel for the editor */}
        <Panel minSize={30}>
          <CodeEditor
            defaultValue={cell.content || starterCode}
            onChange={handleEditorChange}
          />
        </Panel>

        <PanelResizeHandle className="resize-handle">
          <FontAwesomeIcon icon={faGripLinesVertical} className="resize-icon" />
        </PanelResizeHandle>
        {/* Second panel for the preview */}
        <Panel minSize={30}>
          <div className="progress-wrapper">
            {!bundle || bundle.loading ? (
              <div className="progress-cover">
                <div className="loading-spinner"></div>
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
    </div>
  );
};

export default CodeCell;
