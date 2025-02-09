import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useTypedSelector } from '@/hooks/use-typed-selector.ts';
import NoteDependencies from './NoteDependencies.tsx';
import LoadNpmModuleModal from './load-npm.tsx';
import './styles/note-settings-modal.scss';

interface NoteSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  noteId: string;
  notebookId: string;
}

export const NoteSettingsModal: React.FC<NoteSettingsModalProps> = ({
  isOpen,
  onClose,
  noteId,
  notebookId,
}) => {
  // Read depsLock directly from store so we always see what the bundler wrote
  const depsLock = useTypedSelector(
    (state) => state.notes?.[notebookId]?.data?.[noteId]?.depsLock
  );
  const [addNpmOpen, setAddNpmOpen] = useState(false);
  const [addNpmToast, setAddNpmToast] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const previousActiveRef = useRef<Element | null>(null);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    previousActiveRef.current = document.activeElement as Element | null;
    return () => {
      if (
        previousActiveRef.current &&
        previousActiveRef.current instanceof HTMLElement
      ) {
        previousActiveRef.current.focus();
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!addNpmToast) return;
    const t = setTimeout(() => setAddNpmToast(null), 3000);
    return () => clearTimeout(t);
  }, [addNpmToast]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="note-settings-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="note-settings-modal-title"
    >
      <div
        className="note-settings-modal__backdrop"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />
      <div ref={panelRef} className="note-settings-modal__panel">
        <div
          className="note-settings-modal__content"
          onClick={(e) => e.stopPropagation()}
        >
          <header className="note-settings-modal__header">
            <h2
              id="note-settings-modal-title"
              className="note-settings-modal__title"
            >
              Note settings
            </h2>
            <button
              type="button"
              className="note-settings-modal__close"
              onClick={onClose}
              aria-label="Close settings"
            >
              <span aria-hidden>×</span>
            </button>
          </header>

          <div className="note-settings-modal__body">
            <section
              className="note-settings-modal__section"
              aria-labelledby="note-settings-deps-heading"
            >
              <h3
                id="note-settings-deps-heading"
                className="note-settings-modal__section-title"
              >
                Dependencies
              </h3>
              <p className="note-settings-modal__section-desc">
                Packages pinned for this note so code stays reproducible over
                time.
              </p>
              <button
                type="button"
                className="note-settings-modal__add-npm-btn"
                onClick={() => setAddNpmOpen(true)}
              >
                Add NPM module
              </button>
              <NoteDependencies
                noteId={noteId}
                notebookId={notebookId}
                depsLock={depsLock}
              />
            </section>
          </div>

          <footer className="note-settings-modal__footer">
            <button
              type="button"
              className="note-settings-modal__done"
              onClick={onClose}
            >
              Done
            </button>
          </footer>
        </div>
      </div>

      <LoadNpmModuleModal
        isOpen={addNpmOpen}
        onClose={() => setAddNpmOpen(false)}
        noteId={noteId}
        notebookId={notebookId}
        depsLock={depsLock}
        onInstalled={(count) =>
          setAddNpmToast(
            `Pinned ${count} dependenc${count === 1 ? 'y' : 'ies'}`
          )
        }
      />
      {addNpmToast &&
        ReactDOM.createPortal(
          <div
            className="note-dependencies__toast"
            role="status"
            aria-live="polite"
          >
            {addNpmToast}
          </div>,
          document.body
        )}
    </div>,
    document.body
  );
};

export default NoteSettingsModal;
