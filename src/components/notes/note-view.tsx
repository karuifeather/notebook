import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTypedSelector } from '@/hooks/use-typed-selector.ts';
import CellList from '../cells/cell-list.tsx';
import NoteSettingsModal from './NoteSettingsModal.tsx';
import Modal from '../modal.tsx';
import DocumentLayout from './DocumentLayout.tsx';
import {
  makeSelectNoteById,
  selectNotebookById,
  selectNotebookExists,
  selectNoteExists,
} from '@/state/selectors/index.ts';
import { useActions } from '@/hooks/use-actions.ts';
import { useFocusMode } from '@/context/FocusModeContext.tsx';
import Block from '../editors/block.tsx';
import './styles/note-view.scss';
import './styles/document-layout.scss';

interface NoteViewProps {
  playgroundNoteId?: string;
}
const STORAGE_KEY = 'note-details-expanded';

const NoteView: React.FC<NoteViewProps> = ({ playgroundNoteId }) => {
  const params = useParams<{ notebookId: string; noteId: string }>();
  const notebookId = playgroundNoteId
    ? 'playground'
    : (params.notebookId ?? '');
  const noteId = playgroundNoteId ? playgroundNoteId : (params.noteId ?? '');
  const navigate = useNavigate();
  const { isFocusMode, toggleFocusMode, setFocusMode } = useFocusMode();

  const selectNoteById = useMemo(() => makeSelectNoteById(), []);
  const [isModalOpen, setModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const [noteTitle, setNoteTitle] = useState('');
  const [noteDesc, setNoteDesc] = useState('');

  const note = useTypedSelector((state) =>
    selectNoteById(state, notebookId || '', noteId || '')
  );
  const globalNoteTitle = note?.title;
  const globalNoteDesc = note?.description;

  const notebook = useTypedSelector((state) =>
    selectNotebookById(state, notebookId || '')
  ) as { name?: string; title?: string } | undefined;
  const notebookExists = useTypedSelector((state) =>
    notebookId ? selectNotebookExists(state, notebookId) : false
  );
  const noteExists = useTypedSelector((state) =>
    notebookId && noteId ? selectNoteExists(state, notebookId, noteId) : false
  );
  const notebookName = notebook?.name ?? notebook?.title ?? '';

  const { updateNote, deleteNote } = useActions();

  const [detailsExpanded, setDetailsExpanded] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (!notebookId || !noteId) {
      navigate('/404', { replace: true });
      return;
    }
    // For non-playground routes, redirect to 404 if notebook or note does not exist
    if (!playgroundNoteId && (!notebookExists || !noteExists)) {
      navigate('/404', { replace: true });
    }
  }, [
    notebookId,
    noteId,
    notebookExists,
    noteExists,
    playgroundNoteId,
    navigate,
  ]);

  useEffect(() => {
    setNoteTitle(globalNoteTitle || '');
    setNoteDesc(globalNoteDesc || '');
  }, [globalNoteTitle, globalNoteDesc]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, detailsExpanded ? 'true' : 'false');
    } catch {}
  }, [detailsExpanded]);

  // Focus mode: Cmd/Ctrl+Shift+F toggle, Esc exit (when not in input/textarea/contenteditable)
  useEffect(() => {
    if (playgroundNoteId) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as Node | null;
      const isFormField =
        target &&
        (target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement ||
          (target instanceof HTMLElement && target.isContentEditable));
      if (e.key === 'Escape' && isFocusMode && !isFormField) {
        e.preventDefault();
        setFocusMode(false);
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'F') {
        if (!isFormField) {
          e.preventDefault();
          toggleFocusMode();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocusMode, toggleFocusMode, setFocusMode, playgroundNoteId]);

  const persistNote = useCallback(
    (title: string, description: string) => {
      updateNote(notebookId, noteId, {
        title: title || 'Untitled Note',
        description,
      });
    },
    [notebookId, noteId, updateNote]
  );

  const handleBlur = useCallback(
    (committedDesc?: string) => {
      const title = noteTitle || 'Untitled Note';
      const desc = committedDesc ?? noteDesc ?? '';
      if (
        title !== (globalNoteTitle || 'Untitled Note') ||
        desc !== (globalNoteDesc ?? '')
      ) {
        persistNote(title, desc);
      }
    },
    [noteTitle, noteDesc, globalNoteTitle, globalNoteDesc, persistNote]
  );

  const handleTitleCommit = useCallback(
    (committedTitle?: string) => {
      const title = (committedTitle ?? noteTitle) || 'Untitled Note';
      if (committedTitle !== undefined) setNoteTitle(committedTitle);
      if (
        title !== (globalNoteTitle || 'Untitled Note') ||
        noteDesc !== (globalNoteDesc ?? '')
      ) {
        persistNote(title, noteDesc ?? '');
      }
    },
    [noteTitle, noteDesc, globalNoteTitle, globalNoteDesc, persistNote]
  );

  const displayTitle = noteTitle || globalNoteTitle || '';

  const handleDeleteNote = useCallback(() => {
    deleteNote(notebookId, noteId);
    setDeleteConfirmOpen(false);
    navigate(`/app/notebook/${notebookId}`);
  }, [notebookId, noteId, deleteNote, navigate]);

  // Inline editable title state
  const [titleEditing, setTitleEditing] = useState(false);
  const [titleEditValue, setTitleEditValue] = useState(displayTitle);
  useEffect(() => {
    if (!titleEditing) setTitleEditValue(displayTitle || 'Untitled');
  }, [displayTitle, titleEditing]);

  const commitTitle = useCallback(() => {
    setTitleEditing(false);
    const trimmed = titleEditValue.trim() || 'Untitled';
    setNoteTitle(trimmed);
    handleTitleCommit(trimmed);
  }, [titleEditValue, handleTitleCommit]);

  const cancelTitle = useCallback(() => {
    setTitleEditValue(displayTitle || 'Untitled');
    setTitleEditing(false);
  }, [displayTitle]);

  const handleTitleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        commitTitle();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cancelTitle();
      }
    },
    [commitTitle, cancelTitle]
  );

  if (!notebookId || !noteId) {
    return null;
  }
  if (!playgroundNoteId && (!notebookExists || !noteExists)) {
    return null;
  }

  return (
    <div className="note-page">
      {/* Minimal sticky top bar: status + actions (hidden on playground) */}
      {!playgroundNoteId && (
        <header
          className={`note-page__topbar ${isFocusMode ? 'note-page__topbar--focus' : ''}`}
        >
          <span className="note-page__status" aria-live="polite">
            Saved
          </span>
          <div className="note-page__actions">
            {!isFocusMode && (
              <>
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="note-page__action-btn"
                  aria-label="Settings / Dependencies"
                  title="Settings"
                >
                  <i className="fas fa-cog" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmOpen(true)}
                  className="note-page__action-btn note-page__action-btn--danger"
                  aria-label="Delete note"
                  title="Delete"
                >
                  <i className="fas fa-trash-alt" aria-hidden />
                </button>
              </>
            )}
            <button
              type="button"
              onClick={toggleFocusMode}
              className="note-page__action-btn note-page__action-btn--focus"
              aria-pressed={isFocusMode}
              aria-label={isFocusMode ? 'Exit focus mode' : 'Focus mode'}
              title={
                isFocusMode ? 'Exit focus (Esc)' : 'Focus mode (Ctrl+Shift+F)'
              }
            >
              {isFocusMode ? (
                <>
                  <i className="fas fa-compress-alt" aria-hidden />
                  <span className="note-page__exit-focus-label">
                    Exit focus
                  </span>
                </>
              ) : (
                <i className="fas fa-expand" aria-hidden />
              )}
            </button>
          </div>
        </header>
      )}

      {/* Document canvas: single DocumentLayout grid for alignment */}
      <DocumentLayout>
        <div className="document-layout__gutter-header" aria-hidden="true" />
        <div className="document-layout__header">
          {/* Title hero — inline editable */}
          <div className="note-page__title-wrap">
            {titleEditing ? (
              <input
                type="text"
                value={titleEditValue}
                onChange={(e) => setTitleEditValue(e.target.value)}
                onBlur={commitTitle}
                onKeyDown={handleTitleKeyDown}
                className="note-page__title-input"
                aria-label="Note title"
                autoFocus
              />
            ) : (
              <h1
                className="note-page__title"
                onClick={() => setTitleEditing(true)}
                onFocus={() => setTitleEditing(true)}
                tabIndex={0}
                role="button"
                aria-label="Edit note title"
              >
                {displayTitle || 'Untitled'}
              </h1>
            )}
          </div>

          {/* Meta row: breadcrumb */}
          <div className="note-page__meta">
            {notebookName && (
              <span className="note-page__breadcrumb">
                Notebooks › {notebookName}
              </span>
            )}
          </div>

          {/* Optional Details: collapsed by default */}
          <div className="note-page__details">
            <button
              type="button"
              className="note-page__details-trigger"
              onClick={() => {
                if (detailsExpanded) handleBlur();
                setDetailsExpanded((e) => !e);
              }}
              aria-expanded={detailsExpanded}
              aria-controls="note-page-details-content"
              id="note-page-details-toggle"
            >
              <span className="note-page__details-label">Details</span>
              <i
                className={`fas fa-chevron-${detailsExpanded ? 'up' : 'down'} note-page__details-chevron`}
                aria-hidden
              />
            </button>
            <div
              id="note-page-details-content"
              role="region"
              aria-labelledby="note-page-details-toggle"
              className="note-page__details-content"
              hidden={!detailsExpanded}
            >
              {detailsExpanded && (
                <div className="note-page__details-inner">
                  <label
                    htmlFor="note-page-desc"
                    className="note-page__details-field-label"
                  >
                    Description
                  </label>
                  <div id="note-page-desc" className="note-page__details-desc">
                    <Block
                      onBlur={handleBlur}
                      content={noteDesc}
                      variant="description"
                      handler={setNoteDesc}
                      className="note-page__description-block"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Blocks: direct grid children (subgrid rows for gutter + content) */}
        <CellList noteId={noteId} notebookId={notebookId} />
      </DocumentLayout>

      <NoteSettingsModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        noteId={noteId}
        notebookId={notebookId}
      />
      {deleteConfirmOpen && (
        <Modal
          title="Delete note"
          onConfirm={handleDeleteNote}
          onCancel={() => setDeleteConfirmOpen(false)}
        >
          <p className="text-[var(--text)]">
            Are you sure you want to delete{' '}
            <strong>{displayTitle || 'Untitled'}</strong>? This cannot be
            undone.
          </p>
        </Modal>
      )}
    </div>
  );
};

export default NoteView;
