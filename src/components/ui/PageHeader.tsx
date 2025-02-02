import React, { useCallback, useEffect, useState } from 'react';

interface PageHeaderProps {
  title: string;
  status?: string;
  children?: React.ReactNode;
  /** When set, title becomes click-to-edit inline. Enter/blur save, Esc cancels. */
  onTitleChange?: (value: string) => void;
  /** Called on commit; receives the committed title so parent can persist immediately. */
  onTitleBlur?: (committedTitle?: string) => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  status,
  children,
  onTitleChange,
  onTitleBlur,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);

  useEffect(() => {
    if (!isEditing) setEditValue(title);
  }, [title, isEditing]);

  const isEditable = typeof onTitleChange === 'function';

  const startEditing = useCallback(() => {
    if (!isEditable) return;
    setEditValue(title);
    setIsEditing(true);
  }, [isEditable, title]);

  const commitEdit = useCallback(() => {
    if (!isEditable) return;
    setIsEditing(false);
    const trimmed = editValue.trim() || 'Untitled Note';
    if (trimmed !== title) {
      onTitleChange(trimmed);
    } else {
      setEditValue(title);
    }
    onTitleBlur?.(trimmed);
  }, [isEditable, editValue, title, onTitleChange, onTitleBlur]);

  const cancelEdit = useCallback(() => {
    setEditValue(title);
    setIsEditing(false);
    onTitleBlur?.();
  }, [title, onTitleBlur]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        commitEdit();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cancelEdit();
      }
    },
    [commitEdit, cancelEdit]
  );

  return (
    <header
      className="flex h-14 flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface)] px-4 transition-colors duration-[var(--transition-base)] md:h-16"
      style={{ paddingLeft: 'var(--space-4)', paddingRight: 'var(--space-4)' }}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {isEditable && isEditing ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleKeyDown}
            className="min-w-0 flex-1 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface2)] px-3 py-1.5 text-lg font-semibold text-[var(--text)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)] md:text-xl"
            style={{ maxWidth: 'min(100%, 420px)' }}
            aria-label="Note title"
            autoFocus
          />
        ) : (
          <h1
            className={`truncate text-lg font-semibold text-[var(--text)] md:text-xl ${
              isEditable
                ? 'cursor-pointer rounded-[var(--radius-md)] py-1 px-2 -mx-2 hover:bg-[var(--surface2)] focus-ring focus:outline-none'
                : ''
            }`}
            onClick={isEditable ? startEditing : undefined}
            onFocus={isEditable ? startEditing : undefined}
            tabIndex={isEditable ? 0 : undefined}
            role={isEditable ? 'button' : undefined}
            aria-label={isEditable ? 'Edit note title' : undefined}
          >
            {title}
          </h1>
        )}
        {status && (
          <span
            className="shrink-0 text-sm text-[var(--muted)]"
            aria-live="polite"
          >
            {status}
          </span>
        )}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </header>
  );
};
