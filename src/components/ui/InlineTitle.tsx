import React, { useCallback, useEffect, useState } from 'react';

interface InlineTitleProps {
  value: string;
  onChange: (value: string) => void;
  /** Called on commit with the committed value so parent can persist without relying on state. */
  onBlur?: (committedValue: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Large heading (32–40px), click-to-edit inline.
 * Enter/blur saves; Esc cancels; focus uses accent ring.
 */
export const InlineTitle: React.FC<InlineTitleProps> = ({
  value,
  onChange,
  onBlur,
  placeholder = 'Untitled',
  className = '',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  useEffect(() => {
    if (!isEditing) setEditValue(value);
  }, [value, isEditing]);

  const commit = useCallback(() => {
    setIsEditing(false);
    const trimmed = editValue.trim() || placeholder;
    if (trimmed !== value) onChange(trimmed);
    onBlur?.(trimmed);
  }, [editValue, value, onChange, onBlur, placeholder]);

  const cancel = useCallback(() => {
    setEditValue(value);
    setIsEditing(false);
    onBlur?.(value);
  }, [value, onBlur]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        commit();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cancel();
      }
    },
    [commit, cancel]
  );

  return (
    <div className={`inline-title ${className}`}>
      {isEditing ? (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          className="inline-title__input"
          placeholder={placeholder}
          aria-label="Notebook title"
          autoFocus
        />
      ) : (
        <h1
          className="inline-title__display"
          onClick={() => setIsEditing(true)}
          role="button"
          tabIndex={0}
          onFocus={() => setIsEditing(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsEditing(true);
            }
          }}
          aria-label="Edit notebook title"
        >
          {value || placeholder}
        </h1>
      )}
    </div>
  );
};
