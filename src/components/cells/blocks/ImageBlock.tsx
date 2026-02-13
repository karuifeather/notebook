import React, { useCallback, useRef, useState } from 'react';
import { Cell } from '@/state/index.ts';
import { useActions } from '@/hooks/use-actions.ts';
import {
  parseBlockContent,
  defaultImageContent,
} from '@/utils/block-content.ts';
import type { ImageContent } from '@/state/types/block-content.ts';
import './styles/image-block.scss';

interface ImageBlockProps {
  cell: Cell;
  noteId: string;
}

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });

const ImageBlock: React.FC<ImageBlockProps> = ({ cell, noteId }) => {
  const { updateCell } = useActions();
  const data = parseBlockContent<ImageContent>(
    cell.content,
    defaultImageContent()
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const persist = useCallback(
    (next: ImageContent) => {
      updateCell(noteId, cell.id, JSON.stringify(next));
      setLoadError(false);
    },
    [noteId, cell.id, updateCell]
  );

  const setImageFromFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) return;
      readFileAsDataUrl(file).then((src) => {
        persist({ ...data, src, alt: data.alt || file.name });
      });
    },
    [data, persist]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const item = e.clipboardData?.items?.[0];
      if (item?.kind === 'file' && item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) setImageFromFile(file);
      }
    },
    [setImageFromFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer?.files?.[0];
      if (file?.type.startsWith('image/')) setImageFromFile(file);
    },
    [setImageFromFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragOver(false), []);

  const handleUploadClick = () => inputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageFromFile(file);
    e.target.value = '';
  };

  const handleReplace = () => inputRef.current?.click();

  const handleCopyLink = () => {
    if (data.src) {
      navigator.clipboard.writeText(data.src);
    }
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    persist({ ...data, caption: e.target.value });
  };

  const hasImage = !!data.src;

  return (
    <div
      className="image-block"
      data-block="image"
      onPaste={handlePaste}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="image-block__input"
        aria-label="Upload image"
        onChange={handleFileChange}
      />
      {!hasImage ? (
        <button
          type="button"
          className={`image-block__placeholder ${dragOver ? 'image-block__placeholder--drag' : ''}`}
          onClick={handleUploadClick}
          aria-label="Upload image or drag and drop"
        >
          <span className="image-block__placeholder-icon" aria-hidden>
            📷
          </span>
          <span>Upload image or paste / drag and drop</span>
        </button>
      ) : (
        <div className="image-block__wrap">
          <div className="image-block__img-wrap">
            {loadError ? (
              <div className="image-block__error" role="alert">
                Image failed to load
              </div>
            ) : (
              <img
                src={data.src}
                alt={data.alt || ''}
                className="image-block__img"
                onError={() => setLoadError(true)}
                loading="lazy"
              />
            )}
          </div>
          <div className="image-block__actions">
            <button
              type="button"
              className="image-block__action"
              onClick={handleReplace}
              aria-label="Replace image"
            >
              Replace
            </button>
            <button
              type="button"
              className="image-block__action"
              onClick={handleCopyLink}
              aria-label="Copy image link"
            >
              Copy link
            </button>
          </div>
          <input
            type="text"
            className="image-block__caption"
            placeholder="Add a caption"
            value={data.caption ?? ''}
            onChange={handleCaptionChange}
            aria-label="Image caption"
          />
        </div>
      )}
    </div>
  );
};

export default ImageBlock;
