import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useActions } from '@/hooks/use-actions.ts';
import { useTypedSelector } from '@/hooks/use-typed-selector.ts';
import {
  selectNotebookById,
  selectNotebookExists,
  makeSelectNotesByNotebookId,
} from '@/state/selectors/index.ts';
import { DocumentCanvas } from '../ui/DocumentCanvas';
import { InlineTitle } from '../ui/InlineTitle';
import { MetaRow } from '../ui/MetaRow';
import { DescriptionBlock } from '../ui/DescriptionBlock';
import { DocCover } from './DocCover';
import Modal from '../modal.tsx';
import { EditCoverModal } from './EditCoverModal';
import { NotesSection } from './NotesSection';

/** Notebook from selector may have name (real) or title (fallback) */
function getNotebookName(nb: ReturnType<typeof selectNotebookById>): string {
  const n = nb as { name?: string; title?: string };
  return n?.name ?? n?.title ?? '';
}
function getNotebookDescription(
  nb: ReturnType<typeof selectNotebookById>
): string {
  return (nb as { description?: string })?.description ?? '';
}
function getNotebookCover(
  nb: ReturnType<typeof selectNotebookById>
): string | null {
  const v = (nb as { coverImage?: string | null })?.coverImage;
  return v ?? null;
}

interface NotebookViewProps {
  /** Fallback cover URL when notebook has no stored cover (e.g. legacy). */
  coverImage?: string | null;
}

export default function NotebookView({ coverImage = null }: NotebookViewProps) {
  const { notebookId } = useParams();
  const navigate = useNavigate();
  const selectNotesByNotebookId = makeSelectNotesByNotebookId();

  const notebook = useTypedSelector((state) =>
    selectNotebookById(state, notebookId ?? '')
  );
  const notebookExists = useTypedSelector((state) =>
    notebookId ? selectNotebookExists(state, notebookId) : false
  );
  const notes = useTypedSelector((state) =>
    notebookId ? selectNotesByNotebookId(state, notebookId) : []
  );

  const [notebookTitle, setNotebookTitle] = useState('');
  const [notebookDesc, setNotebookDesc] = useState('');
  const [coverModalOpen, setCoverModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { createNote, updateNotebook, updateNotebookCover, deleteNotebook } =
    useActions();

  const storedCover = getNotebookCover(notebook);
  const displayCover = storedCover ?? coverImage ?? null;

  useEffect(() => {
    setNotebookTitle(getNotebookName(notebook));
    setNotebookDesc(getNotebookDescription(notebook));
  }, [notebook]);

  useEffect(() => {
    if (!notebookId) {
      navigate('/app', { replace: true });
      return;
    }
    if (!notebookExists) {
      navigate('/404', { replace: true });
    }
  }, [notebookId, notebookExists, navigate]);

  const handleTitleBlur = useCallback(
    (committedTitle?: string) => {
      if (!notebookId) return;
      const name =
        (committedTitle ?? notebookTitle).trim() || 'Untitled Notebook';
      if (
        name !== getNotebookName(notebook) ||
        notebookDesc !== getNotebookDescription(notebook)
      ) {
        updateNotebook(notebookId, name, notebookDesc);
      }
    },
    [notebookId, notebookTitle, notebookDesc, notebook, updateNotebook]
  );

  const handleDescriptionBlur = useCallback(
    (committedDesc?: string) => {
      if (!notebookId) return;
      const desc = committedDesc ?? notebookDesc;
      const name =
        getNotebookName(notebook) || notebookTitle || 'Untitled Notebook';
      if (desc !== getNotebookDescription(notebook)) {
        updateNotebook(notebookId, name, desc);
      }
    },
    [notebookId, notebookDesc, notebook, notebookTitle, updateNotebook]
  );

  const handleNewNote = useCallback(
    (title: string) => {
      if (!notebookId || !title.trim()) return;
      createNote(notebookId, {
        title: title.trim(),
        description: '',
        dependencies: [],
      });
    },
    [notebookId, createNote]
  );

  const onEditCover = useCallback(() => {
    setCoverModalOpen(true);
  }, []);

  const handleCoverSave = useCallback(
    (coverImage: string | null) => {
      if (notebookId) {
        updateNotebookCover(notebookId, coverImage);
      }
      setCoverModalOpen(false);
    },
    [notebookId, updateNotebookCover]
  );

  const handleDeleteNotebook = useCallback(() => {
    if (!notebookId) return;
    deleteNotebook(notebookId);
    setDeleteConfirmOpen(false);
    setSettingsOpen(false);
    navigate('/app');
  }, [notebookId, deleteNotebook, navigate]);

  if (!notebookId) return null;
  if (!notebookExists) return null;

  const displayTitle =
    notebookTitle || getNotebookName(notebook) || 'Untitled Notebook';
  const noteRows = notes.map((n) => ({
    id: n.id!,
    title: n.title || 'Untitled',
  }));

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {coverModalOpen && (
        <EditCoverModal
          notebookId={notebookId}
          currentCover={storedCover}
          onSave={handleCoverSave}
          onClose={() => setCoverModalOpen(false)}
        />
      )}
      {deleteConfirmOpen && (
        <Modal
          title="Delete notebook"
          onConfirm={handleDeleteNotebook}
          onCancel={() => setDeleteConfirmOpen(false)}
        >
          <p className="text-[var(--text)]">
            Are you sure you want to delete <strong>{displayTitle}</strong>?
            Everything inside will be deleted.
          </p>
        </Modal>
      )}
      {settingsOpen && (
        <Modal
          title="Notebook settings"
          onConfirm={() => setSettingsOpen(false)}
          onCancel={() => setSettingsOpen(false)}
        >
          <div className="space-y-3 text-[var(--text)]">
            <p className="text-sm text-[var(--muted)]">
              Name and description are edited on the page.
            </p>
            <button
              type="button"
              onClick={() => {
                setSettingsOpen(false);
                setDeleteConfirmOpen(true);
              }}
              className="rounded-[var(--radius-md)] border border-[var(--danger)] bg-transparent px-3 py-2 text-sm font-medium text-[var(--danger)] hover:bg-[var(--danger)]/10 focus-ring"
            >
              Delete this notebook
            </button>
          </div>
        </Modal>
      )}
      <DocumentCanvas>
        <DocCover coverImage={displayCover} onEditCover={onEditCover} />

        <InlineTitle
          value={notebookTitle}
          onChange={setNotebookTitle}
          onBlur={handleTitleBlur}
          placeholder="Untitled Notebook"
        />

        <MetaRow
          breadcrumb={[
            { label: 'Notebooks', href: '/app' },
            { label: displayTitle },
          ]}
          status="Saved"
          className="mb-6"
        >
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition-colors hover:bg-[var(--surface2)] hover:text-[var(--text)] focus-ring"
            aria-label="Notebook settings"
          >
            <i className="fas fa-cog" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteConfirmOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition-colors hover:bg-[var(--surface2)] hover:text-[var(--danger)] focus-ring"
            aria-label="Delete notebook"
          >
            <i className="fas fa-trash-alt" />
          </button>
        </MetaRow>

        <DescriptionBlock
          value={notebookDesc}
          onChange={setNotebookDesc}
          onBlur={handleDescriptionBlur}
          placeholder="Add a description…"
        />

        <NotesSection
          notebookId={notebookId}
          notes={noteRows}
          onAddNote={handleNewNote}
        />
      </DocumentCanvas>
    </div>
  );
}
