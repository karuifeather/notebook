import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useActions } from '@/hooks/use-actions.ts';
import { resolvePinnedVersions } from '@/bundler/resolve-versions.ts';
import type { DepsLock } from '@/state/types/note.ts';
import './styles/note-dependencies.scss';

interface NoteDependenciesProps {
  noteId: string;
  notebookId: string;
  depsLock: DepsLock | undefined;
}

export const NoteDependencies: React.FC<NoteDependenciesProps> = ({
  noteId,
  notebookId,
  depsLock,
}) => {
  const { noteDepsLockMerge, updateNote } = useActions();
  const [updating, setUpdating] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [showUpdatedToast, setShowUpdatedToast] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  const entries = depsLock ? Object.entries(depsLock) : [];
  const isEmpty = entries.length === 0;

  const handleUpdateDependencies = useCallback(async () => {
    if (isEmpty) return;
    setUpdating(true);
    try {
      const { resolved, errors } = await resolvePinnedVersions(
        Object.keys(depsLock!)
      );
      if (Object.keys(resolved).length > 0) {
        noteDepsLockMerge(notebookId, noteId, resolved);
        setShowUpdatedToast(true);
      }
      if (errors.length > 0) {
        console.warn(
          '[NoteDependencies] Some packages could not be resolved:',
          errors
        );
      }
    } finally {
      setUpdating(false);
    }
  }, [notebookId, noteId, depsLock, isEmpty, noteDepsLockMerge]);

  const handleCopyLock = useCallback(() => {
    const json = JSON.stringify(depsLock ?? {}, null, 2);
    navigator.clipboard.writeText(json).then(
      () => setShowCopyToast(true),
      () => {}
    );
  }, [depsLock]);

  const handleResetLock = useCallback(() => {
    updateNote(notebookId, noteId, { depsLock: {} });
    setResetConfirm(false);
  }, [notebookId, noteId, updateNote]);

  useEffect(() => {
    if (!showCopyToast) return;
    const t = setTimeout(() => setShowCopyToast(false), 2000);
    return () => clearTimeout(t);
  }, [showCopyToast]);

  useEffect(() => {
    if (!showUpdatedToast) return;
    const t = setTimeout(() => setShowUpdatedToast(false), 3000);
    return () => clearTimeout(t);
  }, [showUpdatedToast]);

  return (
    <>
      <div className="note-dependencies">
        <span className="note-dependencies__label">Pinned dependencies</span>
        {isEmpty ? (
          <p className="note-dependencies__empty">
            No pinned packages yet. Add bare imports in code cells (e.g.{' '}
            <code>{`import _ from 'lodash'`}</code>) or use &quot;Add NPM
            module&quot; above to pin versions.
          </p>
        ) : (
          <>
            <ul
              className="note-dependencies__list"
              aria-label="Pinned packages"
            >
              {entries.map(([pkg, version]) => (
                <li key={pkg} className="note-dependencies__item">
                  <code>
                    {pkg}@{version}
                  </code>
                </li>
              ))}
            </ul>
            <div className="note-dependencies__actions">
              <button
                type="button"
                className="note-dependencies__btn"
                onClick={handleUpdateDependencies}
                disabled={updating}
              >
                {updating ? 'Updating…' : 'Update dependencies'}
              </button>
              <button
                type="button"
                className="note-dependencies__btn note-dependencies__btn--tertiary"
                onClick={handleCopyLock}
              >
                Copy lock JSON
              </button>
              {resetConfirm ? (
                <>
                  <span className="note-dependencies__reset-label">
                    Reset lock?
                  </span>
                  <button
                    type="button"
                    className="note-dependencies__btn note-dependencies__btn--danger"
                    onClick={handleResetLock}
                  >
                    Yes, reset
                  </button>
                  <button
                    type="button"
                    className="note-dependencies__btn note-dependencies__btn--tertiary"
                    onClick={() => setResetConfirm(false)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="note-dependencies__btn note-dependencies__btn--danger"
                  onClick={() => setResetConfirm(true)}
                >
                  Reset lock
                </button>
              )}
            </div>
          </>
        )}
      </div>
      {showCopyToast &&
        ReactDOM.createPortal(
          <div
            className="note-dependencies__toast"
            role="status"
            aria-live="polite"
          >
            Lock copied to clipboard
          </div>,
          document.body
        )}
      {showUpdatedToast &&
        ReactDOM.createPortal(
          <div
            className="note-dependencies__toast"
            role="status"
            aria-live="polite"
          >
            Dependencies updated to latest
          </div>,
          document.body
        )}
    </>
  );
};

export default NoteDependencies;
