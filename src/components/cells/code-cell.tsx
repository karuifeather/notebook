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
    <div className="code-cell border rounded shadow-md bg-gray-800 text-white">
      {/* Tab Header */}
      <div className="flex border-b border-gray-800 bg-gray-900 rounded-t-lg shadow-md">
        <button
          className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium focus:outline-none transition-all duration-300 rounded-t-md ${
            activeTab === 'write'
              ? 'text-white bg-gray-700 shadow-sm'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
          onClick={() => setActiveTab('write')}
        >
          <i className="fas fa-code text-xs"></i> Code
          {activeTab === 'write' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full transition-all duration-300"></span>
          )}
        </button>
        <button
          className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium focus:outline-none transition-all duration-300 rounded-t-md ${
            activeTab === 'preview'
              ? 'text-white bg-gray-700 shadow-sm'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
          onClick={() => setActiveTab('preview')}
        >
          <i className="fas fa-eye text-xs"></i> Preview
          {activeTab === 'preview' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full transition-all duration-300"></span>
          )}
        </button>
      </div>

      {/* Tab Content */}
      <>
        {activeTab === 'write' && (
          <CodeEditor
            defaultValue={cell.content || starterCode}
            onChange={handleEditorChange}
          />
        )}
        {activeTab === 'preview' && (
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
      </>
    </div>
  );
};

export default CodeCell;
