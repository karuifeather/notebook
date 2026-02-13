import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useActions } from '@/hooks/use-actions.ts';
import { useTypedSelector } from '@/hooks/use-typed-selector.ts';
import CodeEditor from '@/components/editors/code-editor.tsx';
import Preview from '@/components/cells/preview.tsx';
import { Cell } from '@/state/index.ts';
import { makeSelectBundleById } from '@/state/selectors/index.ts';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { CODE_CELL_STARTER } from '@/constants/code-cell.ts';
import './styles/code-cell.scss';

const BUNDLE_DEBOUNCE_MS = 750;

interface CodeCellProps {
  cell: Cell;
  noteId: string;
  /** Notebook ID (parent of note); used for per-note depsLock when bundling. */
  notebookId?: string;
}

const selectBundle = makeSelectBundleById();

const IconCode = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);
const IconPreview = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);
const IconConsole = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </svg>
);

const CodeCell: React.FC<CodeCellProps> = ({ cell, noteId, notebookId }) => {
  const { updateCell, bundleIt } = useActions();
  const bundleContext = useMemo(
    () =>
      notebookId != null && noteId != null
        ? { noteId, parentId: notebookId }
        : undefined,
    [notebookId, noteId]
  );
  const bundle = useTypedSelector((state) => selectBundle(state, cell.id));
  const [activeTab, setActiveTab] = useState<'write' | 'preview' | 'console'>(
    'write'
  );
  const [expanded, setExpanded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const bundleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const codeToBundle = (cell.content || '').trim() || CODE_CELL_STARTER;
  const isFirstBundleForCell = useRef(true);
  const prevCellIdRef = useRef(cell.id);

  if (prevCellIdRef.current !== cell.id) {
    prevCellIdRef.current = cell.id;
    isFirstBundleForCell.current = true;
  }

  // Bundle on mount (once per cell) and debounced re-bundle when code changes
  useEffect(() => {
    if (isFirstBundleForCell.current) {
      isFirstBundleForCell.current = false;
      bundleIt(cell.id, codeToBundle, bundleContext);
      return;
    }
    if (bundleTimeoutRef.current) clearTimeout(bundleTimeoutRef.current);
    bundleTimeoutRef.current = setTimeout(() => {
      bundleTimeoutRef.current = null;
      bundleIt(cell.id, codeToBundle, bundleContext);
    }, BUNDLE_DEBOUNCE_MS);
    return () => {
      if (bundleTimeoutRef.current) clearTimeout(bundleTimeoutRef.current);
    };
  }, [cell.id, codeToBundle, bundleContext]);

  const handleEditorChange = useCallback(
    (value: string) => {
      updateCell(noteId, cell.id, value);
    },
    [updateCell, noteId, cell.id]
  );

  const handleRun = useCallback(() => {
    if (bundleTimeoutRef.current) {
      clearTimeout(bundleTimeoutRef.current);
      bundleTimeoutRef.current = null;
    }
    bundleIt(cell.id, codeToBundle, bundleContext);
  }, [bundleIt, cell.id, codeToBundle, bundleContext]);

  const toggleFullscreen = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      // eslint-disable-next-line prettier/prettier -- avoid build mismatch (Vercel vs local Prettier)
      el
        .requestFullscreen?.()
        .then(() => setIsFullscreen(true))
        .catch(() => {});
    } else {
      // eslint-disable-next-line prettier/prettier -- avoid build mismatch (Vercel vs local Prettier)
      document
        .exitFullscreen?.()
        .then(() => setIsFullscreen(false))
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  return (
    <div className="code-cell">
      <div className="code-cell__tabs">
        <SegmentedTabs
          tabs={[
            { id: 'write', label: <IconCode />, title: 'Code' },
            { id: 'preview', label: <IconPreview />, title: 'Preview' },
            { id: 'console', label: <IconConsole />, title: 'Console' },
          ]}
          activeId={activeTab}
          onChange={(id) => setActiveTab(id as 'write' | 'preview' | 'console')}
        />
        {activeTab === 'write' && (
          <>
            <button
              type="button"
              className="code-cell__run-btn"
              onClick={handleRun}
              aria-label="Run code"
              title="Run code (bundle and update preview)"
            >
              Run
            </button>
            <button
              type="button"
              className="code-cell__expand-btn"
              onClick={() => setExpanded((e) => !e)}
              aria-label={
                expanded ? 'Collapse code block' : 'Expand code block'
              }
              title={expanded ? 'Collapse' : 'Expand'}
            >
              {expanded ? 'Collapse' : 'Expand'}
            </button>
          </>
        )}
        <button
          type="button"
          className="code-cell__expand-btn"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? 'Exit full screen' : 'View full screen'}
          title={isFullscreen ? 'Exit full screen (Esc)' : 'View full screen'}
        >
          {isFullscreen ? 'Exit full screen' : 'Full screen'}
        </button>
      </div>

      <div
        ref={contentRef}
        className={`code-cell__content ${expanded ? 'code-cell__content--expanded' : ''} ${isFullscreen ? 'code-cell__content--fullscreen' : ''}`}
      >
        {activeTab === 'write' ? (
          <CodeEditor
            expanded={expanded}
            value={cell.content || CODE_CELL_STARTER}
            onChange={handleEditorChange}
          />
        ) : (
          <div className="code-cell__preview-wrap">
            {!bundle || bundle.loading ? (
              <div className="code-cell__loading">
                <div className="code-cell__spinner" aria-hidden="true" />
              </div>
            ) : (
              <Preview
                code={bundle.code ?? ''}
                bundlerError={bundle.error ?? ''}
                activeView={activeTab === 'console' ? 'console' : 'preview'}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeCell;
