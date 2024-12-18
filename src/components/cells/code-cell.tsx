import React, { useCallback, useEffect, useState } from 'react';
import { useActions } from '@/hooks/use-actions.ts';
import { useTypedSelector } from '@/hooks/use-typed-selector.ts';
import CodeEditor from '@/components/editors/code-editor.tsx';
import Preview from '@/components/cells/preview.tsx';
import { Cell } from '@/state/index.ts';
import { makeSelectBundleById } from '@/state/selectors/index.ts';
import './styles/code-cell.scss';

interface CodeCellProps {
  cell: Cell;
}

const selectBundle = makeSelectBundleById();

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell, bundleIt } = useActions();
  const bundle = useTypedSelector((state) => selectBundle(state, cell.id));
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write'); // Active tab state
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
    <div className="code-cell">
      {/* Tab Header */}
      <div className="tab-header">
        <button
          className={`tab-button ${activeTab === 'write' ? 'active' : ''}`}
          onClick={() => setActiveTab('write')}
        >
          Code
        </button>
        <button
          className={`tab-button ${activeTab === 'preview' ? 'active' : ''}`}
          onClick={() => setActiveTab('preview')}
        >
          Preview
        </button>
        <div
          className="tab-indicator"
          style={{
            transform: `translateX(${activeTab === 'write' ? '0%' : '100%'})`,
          }}
        />
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'write' ? (
          <CodeEditor
            defaultValue={cell.content || starterCode}
            onChange={handleEditorChange}
          />
        ) : (
          <div className="progress-wrapper">
            {!bundle || bundle.loading ? (
              <div className="progress-cover">
                <div className="loading-spinner"></div>
              </div>
            ) : (
              <Preview code={bundle.code as string} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeCell;
