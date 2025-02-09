import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export interface NoteRow {
  id: string;
  title: string;
  createdAt?: string;
  updatedAt?: string;
}

interface NotesSectionProps {
  notebookId: string;
  notes: NoteRow[];
  onAddNote: (title: string) => void;
  className?: string;
}

/**
 * Notion-like Notes section: header (Notes + New), list rows 44px, inline "+ New note" creation.
 */
export const NotesSection: React.FC<NotesSectionProps> = ({
  notebookId,
  notes,
  onAddNote,
  className = '',
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleCreate = () => {
    const title = newTitle.trim();
    if (title) {
      onAddNote(title);
      setNewTitle('');
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setNewTitle('');
    setIsAdding(false);
  };

  return (
    <section className={`notes-section ${className}`} aria-label="Notes">
      <div className="notes-section__header">
        <h3 className="notes-section__title">Notes</h3>
        <div className="notes-section__actions">
          {!isAdding && (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="notes-section__btn-new"
              aria-label="New note"
            >
              <i className="fas fa-plus" />
              <span>New</span>
            </button>
          )}
        </div>
      </div>

      <div className="notes-section__list">
        {isAdding && (
          <div className="notes-section__inline-add">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleCreate();
                } else if (e.key === 'Escape') {
                  handleCancel();
                }
              }}
              onBlur={() => {
                if (newTitle.trim()) handleCreate();
                else handleCancel();
              }}
              placeholder="Note title…"
              className="notes-section__inline-input"
              autoFocus
              aria-label="New note title"
            />
          </div>
        )}

        {notes.length === 0 && !isAdding ? (
          <div className="notes-section__empty">
            <p className="notes-section__empty-title">No notes yet</p>
            <p className="notes-section__empty-desc">
              Create your first note to start capturing ideas.
            </p>
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="notes-section__empty-cta"
            >
              <i className="fas fa-plus" />
              <span>New note</span>
            </button>
          </div>
        ) : (
          <ul className="notes-section__rows" role="list">
            {notes.map((note) => (
              <li key={note.id} className="notes-section__row-wrap">
                <Link
                  to={`/app/notebook/${notebookId}/note/${note.id}`}
                  className="notes-section__row"
                >
                  <span className="notes-section__row-icon" aria-hidden>
                    <i className="fas fa-file-lines text-[var(--muted)]" />
                  </span>
                  <span className="notes-section__row-title truncate">
                    {note.title || 'Untitled'}
                  </span>
                  {(note.updatedAt || note.createdAt) && (
                    <span className="notes-section__row-meta">
                      {note.updatedAt || note.createdAt}
                    </span>
                  )}
                  <i
                    className="fas fa-chevron-right notes-section__row-chevron"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
            {!isAdding && notes.length > 0 && (
              <li className="notes-section__row-wrap">
                <button
                  type="button"
                  onClick={() => setIsAdding(true)}
                  className="notes-section__row notes-section__row--add"
                  aria-label="Add new note"
                >
                  <i className="fas fa-plus notes-section__row-icon" />
                  <span className="notes-section__row-title text-[var(--muted)]">
                    New note
                  </span>
                </button>
              </li>
            )}
          </ul>
        )}
      </div>
    </section>
  );
};
