import React, { useCallback, useEffect, useRef, useState } from 'react';

interface DescriptionBlockProps {
  value: string;
  onChange: (value: string) => void;
  /** Called on blur with the committed value so parent can persist without relying on state. */
  onBlur?: (committedValue: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Notion-style inline description: placeholder "Add a description…", expands on click.
 * Multi-line, visually minimal.
 */
export const DescriptionBlock: React.FC<DescriptionBlockProps> = ({
  value,
  onChange,
  onBlur,
  placeholder = 'Add a description…',
  className = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    const trimmed = localValue.trim();
    if (trimmed !== value) onChange(trimmed);
    onBlur?.(trimmed);
  }, [localValue, value, onChange, onBlur]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalValue(e.target.value);
    onChange(e.target.value);
  };

  const isEmpty = !localValue.trim();
  const showPlaceholder = isEmpty && !isFocused;

  return (
    <div
      className={`description-block ${className} ${
        isFocused ? 'description-block--focused' : ''
      }`}
    >
      {showPlaceholder ? (
        <button
          type="button"
          onClick={() => {
            setIsFocused(true);
            setTimeout(() => textareaRef.current?.focus(), 0);
          }}
          className="description-block__placeholder"
          aria-label="Add description"
        >
          {placeholder}
        </button>
      ) : (
        <textarea
          ref={textareaRef}
          value={localValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          placeholder={placeholder}
          rows={isEmpty ? 1 : Math.min(6, localValue.split('\n').length + 1)}
          className="description-block__input"
          aria-label="Description"
        />
      )}
    </div>
  );
};
