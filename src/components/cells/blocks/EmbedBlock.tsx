import React, { useCallback, useState, useEffect } from 'react';
import { Cell } from '@/state/index.ts';
import { useActions } from '@/hooks/use-actions.ts';
import {
  parseBlockContent,
  defaultEmbedContent,
} from '@/utils/block-content.ts';
import type { EmbedContent } from '@/state/types/block-content.ts';
import './styles/embed-block.scss';

interface EmbedBlockProps {
  cell: Cell;
  noteId: string;
}

function getDomain(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function faviconUrl(domain: string): string {
  if (!domain) return '';
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
}

const EmbedBlock: React.FC<EmbedBlockProps> = ({ cell, noteId }) => {
  const { updateCell } = useActions();
  const data = parseBlockContent<EmbedContent>(
    cell.content,
    defaultEmbedContent()
  );
  const [editing, setEditing] = useState(!data.url);
  const [urlInput, setUrlInput] = useState(data.url);
  const [localTitle, setLocalTitle] = useState(data.title ?? '');

  const persist = useCallback(
    (next: EmbedContent) => {
      updateCell(noteId, cell.id, JSON.stringify(next));
    },
    [noteId, cell.id, updateCell]
  );

  useEffect(() => {
    setUrlInput(data.url);
    setLocalTitle(data.title ?? '');
  }, [data.url, data.title]);

  const handleSaveUrl = useCallback(() => {
    const url = urlInput.trim();
    if (!url) return;
    const domain = getDomain(url);
    setEditing(false);
    persist({
      ...data,
      url,
      siteName: data.siteName || domain,
      title: localTitle.trim() || data.title,
      favicon: data.favicon || (domain ? faviconUrl(domain) : ''),
    });
  }, [urlInput, localTitle, data, persist]);

  const handleOpenLink = useCallback(() => {
    if (data.url) window.open(data.url, '_blank', 'noopener,noreferrer');
  }, [data.url]);

  const domain = getDomain(data.url);
  const favicon = data.favicon || (domain ? faviconUrl(domain) : '');

  return (
    <div className="embed-block" data-block="embed">
      {editing ? (
        <div className="embed-block__edit">
          <input
            type="url"
            className="embed-block__url-input"
            placeholder="Paste URL to embed…"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveUrl();
              if (e.key === 'Escape') setEditing(false);
            }}
            aria-label="Embed URL"
          />
          <input
            type="text"
            className="embed-block__title-input"
            placeholder="Optional title"
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            aria-label="Embed title"
          />
          <div className="embed-block__edit-actions">
            <button
              type="button"
              className="embed-block__btn embed-block__btn--primary"
              onClick={handleSaveUrl}
              aria-label="Save embed"
            >
              Save
            </button>
            <button
              type="button"
              className="embed-block__btn"
              onClick={() => setEditing(false)}
              aria-label="Cancel"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : data.url ? (
        <div className="embed-block__card">
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="embed-block__link"
            onClick={(e) => {
              e.preventDefault();
              handleOpenLink();
            }}
          >
            <div className="embed-block__card-inner">
              {data.image && (
                <div className="embed-block__thumb">
                  <img
                    src={data.image}
                    alt=""
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="embed-block__meta">
                {favicon && (
                  <img
                    src={favicon}
                    alt=""
                    className="embed-block__favicon"
                    width={16}
                    height={16}
                  />
                )}
                <span className="embed-block__site">
                  {data.siteName || domain || 'Link'}
                </span>
                <h3 className="embed-block__title">
                  {data.title || data.url || 'Untitled'}
                </h3>
                {data.description && (
                  <p className="embed-block__desc">{data.description}</p>
                )}
              </div>
            </div>
          </a>
          <div className="embed-block__actions">
            <button
              type="button"
              className="embed-block__action"
              onClick={handleOpenLink}
              aria-label="Open link"
            >
              Open link
            </button>
            <button
              type="button"
              className="embed-block__action"
              onClick={() => setEditing(true)}
              aria-label="Edit URL"
            >
              Edit URL
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="embed-block__placeholder"
          onClick={() => setEditing(true)}
          aria-label="Add embed link"
        >
          Add link or embed URL
        </button>
      )}
    </div>
  );
};

export default EmbedBlock;
