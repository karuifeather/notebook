import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Cell } from '@/state/index.ts';
import { useActions } from '@/hooks/use-actions.ts';
import {
  parseBlockContent,
  defaultCalloutContent,
} from '@/utils/block-content.ts';
import type {
  CalloutContent,
  CalloutVariant,
} from '@/state/types/block-content.ts';
import { markdownRenderer } from '@/utils/markdown.ts';
import './styles/callout-block.scss';

const VARIANTS: { id: CalloutVariant; label: string; emoji: string }[] = [
  { id: 'info', label: 'Info', emoji: 'ℹ️' },
  { id: 'tip', label: 'Tip', emoji: '💡' },
  { id: 'warning', label: 'Warning', emoji: '⚠️' },
  { id: 'danger', label: 'Danger', emoji: '🔴' },
];

interface CalloutBlockProps {
  cell: Cell;
  noteId: string;
}

const CalloutBlock: React.FC<CalloutBlockProps> = ({ cell, noteId }) => {
  const { updateCell } = useActions();
  const data = parseBlockContent<CalloutContent>(
    cell.content,
    defaultCalloutContent()
  );
  const [editing, setEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState(data.title ?? '');
  const [localText, setLocalText] = useState(data.text ?? '');
  const [showVariantPicker, setShowVariantPicker] = useState(false);

  useEffect(() => {
    setLocalTitle(data.title ?? '');
    setLocalText(data.text ?? '');
  }, [data.title, data.text]);

  const persist = useCallback(
    (next: CalloutContent) => {
      updateCell(noteId, cell.id, JSON.stringify(next));
    },
    [noteId, cell.id, updateCell]
  );

  const handleBlur = useCallback(() => {
    setEditing(false);
    setShowVariantPicker(false);
    const title = localTitle.trim();
    const text = localText.trim();
    if (title !== (data.title ?? '') || text !== (data.text ?? '')) {
      persist({
        ...data,
        title: title || undefined,
        text,
      });
    }
  }, [localTitle, localText, data, persist]);

  const handleVariantSelect = useCallback(
    (variant: CalloutVariant) => {
      const v = VARIANTS.find((x) => x.id === variant);
      persist({
        ...data,
        variant,
        emoji: v?.emoji ?? data.emoji,
      });
      setShowVariantPicker(false);
    },
    [data, persist]
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setLocalTitle(e.target.value);
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setLocalText(e.target.value);

  const displayTitle = localTitle || data.title;
  const displayText = localText || data.text;
  const emoji =
    data.emoji || VARIANTS.find((v) => v.id === data.variant)?.emoji || 'ℹ️';

  const renderedHtml = useMemo(
    () => (displayText ? markdownRenderer.render(displayText) : ''),
    [displayText]
  );

  return (
    <div
      className={`callout-block callout-block--${data.variant}`}
      data-block="callout"
    >
      <div className="callout-block__inner">
        <button
          type="button"
          className="callout-block__emoji"
          onClick={() => setShowVariantPicker((v) => !v)}
          aria-label="Change callout type"
          aria-haspopup="listbox"
          aria-expanded={showVariantPicker}
        >
          {emoji}
        </button>
        <div className="callout-block__body">
          {showVariantPicker && (
            <div
              className="callout-block__variant-picker"
              role="listbox"
              aria-label="Callout type"
            >
              {VARIANTS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  role="option"
                  aria-selected={data.variant === v.id}
                  className="callout-block__variant-option"
                  onClick={() => handleVariantSelect(v.id)}
                >
                  <span aria-hidden>{v.emoji}</span>
                  <span>{v.label}</span>
                </button>
              ))}
            </div>
          )}
          {editing ? (
            <>
              <input
                type="text"
                className="callout-block__title-input"
                placeholder="Optional title"
                value={localTitle}
                onChange={handleTitleChange}
                onBlur={handleBlur}
                aria-label="Callout title"
              />
              <textarea
                className="callout-block__text-input"
                placeholder="Write something…"
                value={localText}
                onChange={handleTextChange}
                onBlur={handleBlur}
                aria-label="Callout body"
                rows={3}
              />
            </>
          ) : (
            <div
              className="callout-block__content md"
              onClick={() => setEditing(true)}
              onFocus={() => setEditing(true)}
              role="button"
              tabIndex={0}
              aria-label="Edit callout"
            >
              {displayTitle && (
                <div className="callout-block__title">{displayTitle}</div>
              )}
              {displayText ? (
                <div
                  className="callout-block__text"
                  dangerouslySetInnerHTML={{ __html: renderedHtml }}
                />
              ) : (
                <p className="callout-block__placeholder">Write something…</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalloutBlock;
