import React, { useEffect, useState } from 'react';
import Block from '../editors/block.tsx';

const STORAGE_KEY = 'note-details-expanded';

interface NoteDetailsPanelProps {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onBlur: (committedContent?: string) => void;
  /** Optional notebook name to show as pill when collapsed */
  notebookName?: string;
  /** Controlled expanded state; if undefined, use localStorage default (false) */
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}

export const NoteDetailsPanel: React.FC<NoteDetailsPanelProps> = ({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onBlur,
  notebookName,
  expanded: controlledExpanded,
  onExpandedChange,
}) => {
  const [internalExpanded, setInternalExpanded] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const isControlled = controlledExpanded !== undefined;
  const expanded = isControlled ? controlledExpanded : internalExpanded;

  const setExpanded = (value: boolean) => {
    if (!isControlled) {
      setInternalExpanded(value);
      try {
        localStorage.setItem(STORAGE_KEY, value ? 'true' : 'false');
      } catch {}
    }
    onExpandedChange?.(value);
  };

  useEffect(() => {
    if (!isControlled) return;
    try {
      localStorage.setItem(STORAGE_KEY, controlledExpanded ? 'true' : 'false');
    } catch {}
  }, [isControlled, controlledExpanded]);

  const descriptionPreview = description.trim()
    ? description.replace(/\s+/g, ' ').trim().slice(0, 72) +
      (description.length > 72 ? '…' : '')
    : '';

  return (
    <div
      className="note-details-panel shrink-0 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface2)] shadow-[var(--shadow-sm)] transition-[box-shadow,border-color] duration-[var(--transition-base)]"
      style={{ minHeight: expanded ? undefined : 48 }}
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="note-details-panel__trigger flex h-12 w-full items-center gap-2 rounded-[var(--radius-lg)] border-l-[3px] border-l-transparent bg-transparent px-4 text-left outline-none transition-[background-color,border-color] duration-[var(--transition-base)] hover:bg-[var(--surface)] focus-visible:border-l-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)] focus-visible:ring-inset active:bg-[var(--surface)]"
        style={{
          paddingLeft: 'calc(var(--space-4) - 3px)',
          paddingRight: 'var(--space-4)',
        }}
        aria-expanded={expanded}
        aria-controls="note-details-content"
        id="note-details-toggle"
      >
        <span className="text-sm font-medium text-[var(--muted)]">Details</span>
        <i
          className={`fas fa-chevron-${expanded ? 'up' : 'down'} text-xs text-[var(--muted)] transition-transform duration-[var(--transition-fast)]`}
          aria-hidden
        />
        {!expanded && notebookName && (
          <span
            className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 text-xs text-[var(--muted)]"
            style={{ marginLeft: 'var(--space-1)' }}
          >
            {notebookName}
          </span>
        )}
        {!expanded && descriptionPreview && (
          <span className="min-w-0 flex-1 truncate pl-2 text-xs text-[var(--muted)]">
            {descriptionPreview}
          </span>
        )}
      </button>

      <div
        id="note-details-content"
        role="region"
        aria-labelledby="note-details-toggle"
        className="border-t border-[var(--border)] bg-[var(--surface)]"
        hidden={!expanded}
      >
        {expanded && (
          <div
            className="space-y-3 p-4"
            style={{
              padding: 'var(--space-4)',
              maxWidth: '100%',
            }}
          >
            <div>
              <label
                htmlFor="note-details-title"
                className="mb-1 block text-xs font-medium text-[var(--muted)]"
              >
                Title
              </label>
              <div id="note-details-title">
                <Block
                  onBlur={onBlur}
                  content={title}
                  variant="heading"
                  handler={onTitleChange}
                  className="text-base font-semibold text-[var(--text)]"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="note-details-desc"
                className="mb-1 block text-xs font-medium text-[var(--muted)]"
              >
                Description
              </label>
              <div
                id="note-details-desc"
                className="note-details-panel__description"
              >
                <Block
                  onBlur={onBlur}
                  content={description}
                  variant="description"
                  handler={onDescriptionChange}
                  className="text-sm text-[var(--muted)]"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
