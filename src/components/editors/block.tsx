import React, { useCallback, useEffect, useRef, useState } from 'react';

interface BlockProps {
  content: string;
  variant: 'heading' | 'description' | 'text' | 'todo';
  className?: string;
  handler: (value: string) => void;
  onFocus?: () => void;
  /** Called on blur; receives the committed content so parent can persist without relying on state. */
  onBlur?: (committedContent: string) => void;
}

const MIN_TEXTAREA_HEIGHT = 48;

function resizeTextarea(ta: HTMLTextAreaElement) {
  ta.style.height = 'auto';
  ta.style.height = `${Math.max(MIN_TEXTAREA_HEIGHT, ta.scrollHeight)}px`;
}

const Block: React.FC<BlockProps> = ({
  content,
  handler,
  className = '',
  variant,
  onFocus,
  onBlur,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [localContent, setLocalContent] = useState(content);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setLocalContent(e.target.value);
    const ta = e.target instanceof HTMLTextAreaElement ? e.target : null;
    if (ta) resizeTextarea(ta);

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      handler(e.target.value);
    }, 300);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (timer.current) clearTimeout(timer.current);
    handler(localContent);
    onBlur?.(localContent);
  };

  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  useEffect(() => {
    if (textareaRef.current) resizeTextarea(textareaRef.current);
  }, [content, localContent]);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const setTextareaRef = useCallback((el: HTMLTextAreaElement | null) => {
    textareaRef.current = el;
    if (el) resizeTextarea(el);
  }, []);

  const renderContent = () => {
    const baseStyles = {
      heading:
        'text-2xl sm:text-3xl lg:text-4xl font-bold placeholder-gray-400 dark:placeholder-gray-500',
      description:
        'text-base sm:text-lg text-gray-600 dark:text-gray-400 placeholder-gray-400 dark:placeholder-gray-500',
      text: 'text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500',
      todo: 'text-gray-800 dark:text-gray-200',
    };

    const baseInputStyles = `w-full bg-transparent border-none focus:ring-0 focus:outline-none ${baseStyles[variant]} ${className}`;

    switch (variant) {
      case 'heading':
        return (
          <input
            type="text"
            value={localContent}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Enter a title..."
            className={baseInputStyles}
            aria-label="Heading block"
          />
        );

      case 'description':
      case 'text':
        return (
          <textarea
            ref={setTextareaRef}
            value={localContent}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={
              variant === 'description'
                ? 'Add a description...'
                : 'Type something…'
            }
            className={`block-textarea w-full resize-none overflow-hidden bg-transparent border-none focus:ring-0 focus:outline-none ${baseStyles[variant]} ${className}`}
            style={{ minHeight: MIN_TEXTAREA_HEIGHT }}
            aria-label="Text block"
          />
        );

      case 'todo':
        return (
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-1 cursor-pointer w-5 h-5 rounded border-[var(--border)] text-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)] focus:ring-offset-2 focus:ring-offset-[var(--surface)] transition"
              aria-label="To-do checkbox"
            />
            <textarea
              ref={setTextareaRef}
              value={localContent}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="To-do item…"
              className={`block-textarea w-full resize-none overflow-hidden bg-transparent border-none focus:ring-0 focus:outline-none ${baseStyles.text} ${className}`}
              style={{ minHeight: MIN_TEXTAREA_HEIGHT }}
              aria-label="To-do block"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`block-wrapper relative w-full rounded-[var(--radius-lg)] border bg-[var(--surface)] px-4 py-[14px] shadow-[var(--shadow-sm)] transition-all duration-[var(--transition-base)] ${
        isFocused
          ? 'border-[var(--accent)] outline outline-2 outline-[var(--accent-ring)] outline-offset-0 bg-[var(--surface2)]'
          : 'border-[var(--border)] hover:shadow-[var(--shadow-md)]'
      }`}
    >
      {renderContent()}
    </div>
  );
};

export default Block;
