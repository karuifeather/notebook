import React, { useCallback, useState } from 'react';
import ReactDOM from 'react-dom';
import {
  processCoverImage,
  fetchAndProcessCoverUrl,
  COVER_MAX_WIDTH,
  COVER_MAX_HEIGHT,
} from '@/utils/cover-image.ts';

interface EditCoverModalProps {
  notebookId: string;
  currentCover: string | null;
  onSave: (coverImage: string | null) => void;
  onClose: () => void;
}

export const EditCoverModal: React.FC<EditCoverModalProps> = ({
  currentCover,
  onSave,
  onClose,
}) => {
  const [mode, setMode] = useState<'url' | 'file'>('url');
  const [urlInput, setUrlInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const clearForm = useCallback(() => {
    setUrlInput('');
    setFile(null);
    setPreview(null);
    setError(null);
  }, []);

  const handleRemoveCover = useCallback(() => {
    onSave(null);
    clearForm();
    onClose();
  }, [onSave, clearForm, onClose]);

  const handleApply = useCallback(async () => {
    setError(null);
    if (mode === 'url') {
      const url = urlInput.trim();
      if (!url) {
        setError('Enter an image URL');
        return;
      }
      setLoading(true);
      try {
        const dataUrl = await fetchAndProcessCoverUrl(url);
        onSave(dataUrl);
        clearForm();
        onClose();
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : 'Could not load image from URL. It may be blocked (CORS).'
        );
      } finally {
        setLoading(false);
      }
      return;
    }
    if (mode === 'file' && file) {
      setLoading(true);
      try {
        const dataUrl = await processCoverImage(file);
        onSave(dataUrl);
        clearForm();
        onClose();
      } catch (e) {
        setError(
          e instanceof Error ? e.message : 'Could not process the image.'
        );
      } finally {
        setLoading(false);
      }
      return;
    }
    if (mode === 'file') {
      setError('Choose an image file');
    }
  }, [mode, urlInput, file, onSave, clearForm, onClose]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      setFile(f ?? null);
      setError(null);
      if (f) {
        processCoverImage(f)
          .then(setPreview)
          .catch(() => setPreview(null));
      } else {
        setPreview(null);
      }
    },
    []
  );

  const handleUrlPreview = useCallback(() => {
    const url = urlInput.trim();
    if (!url) return;
    setError(null);
    setLoading(true);
    fetchAndProcessCoverUrl(url)
      .then((dataUrl) => {
        setPreview(dataUrl);
      })
      .catch((e) => {
        setError(
          e instanceof Error ? e.message : 'Could not load image from URL.'
        );
        setPreview(null);
      })
      .finally(() => setLoading(false));
  }, [urlInput]);

  const canApply =
    (mode === 'url' && urlInput.trim()) || (mode === 'file' && file);

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-cover-title"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md rounded-[16px] border border-[var(--border)] bg-[var(--surface)] shadow-lg">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
          <h2
            id="edit-cover-title"
            className="text-base font-semibold text-[var(--text)]"
          >
            Edit cover
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] text-[var(--muted)] hover:bg-[var(--surface2)] hover:text-[var(--text)] focus-ring"
            aria-label="Close"
          >
            <i className="fas fa-times" />
          </button>
        </div>

        <div className="space-y-4 px-4 py-4">
          <p className="text-xs text-[var(--muted)]">
            Recommended: {COVER_MAX_WIDTH}×{COVER_MAX_HEIGHT} px. Image will be
            resized and cached locally.
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode('url')}
              className={`flex-1 rounded-[var(--radius-md)] border px-3 py-2 text-sm font-medium transition-colors focus-ring ${
                mode === 'url'
                  ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--text)]'
                  : 'border-[var(--border)] bg-[var(--surface2)] text-[var(--muted)] hover:border-[var(--muted)]'
              }`}
            >
              From URL
            </button>
            <button
              type="button"
              onClick={() => setMode('file')}
              className={`flex-1 rounded-[var(--radius-md)] border px-3 py-2 text-sm font-medium transition-colors focus-ring ${
                mode === 'file'
                  ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--text)]'
                  : 'border-[var(--border)] bg-[var(--surface2)] text-[var(--muted)] hover:border-[var(--muted)]'
              }`}
            >
              Upload file
            </button>
          </div>

          {mode === 'url' && (
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  setError(null);
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleUrlPreview()}
                placeholder="https://…"
                className="min-w-0 flex-1 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface2)] px-3 py-2 text-sm text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)]"
                aria-label="Image URL"
              />
              <button
                type="button"
                onClick={handleUrlPreview}
                disabled={loading || !urlInput.trim()}
                className="shrink-0 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface2)] px-3 py-2 text-sm font-medium text-[var(--text)] hover:bg-[var(--surface)] focus-ring disabled:opacity-50"
              >
                {loading ? '…' : 'Fetch'}
              </button>
            </div>
          )}

          {mode === 'file' && (
            <label className="block">
              <span className="sr-only">Choose image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-[var(--muted)] file:mr-3 file:rounded-[var(--radius-md)] file:border-0 file:bg-[var(--surface2)] file:px-3 file:py-2 file:text-sm file:font-medium file:text-[var(--text)] hover:file:bg-[var(--surface)]"
              />
            </label>
          )}

          {preview && (
            <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface2)] overflow-hidden">
              <img
                src={preview}
                alt="Cover preview"
                className="h-32 w-full object-cover"
              />
            </div>
          )}

          {error && (
            <p className="text-sm text-[var(--danger)]" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] px-4 py-3">
          <div>
            {currentCover && (
              <button
                type="button"
                onClick={handleRemoveCover}
                className="text-sm text-[var(--muted)] hover:text-[var(--danger)] focus-ring rounded px-1 py-0.5"
              >
                Remove cover
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-[var(--text)] hover:bg-[var(--surface2)] focus-ring"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={loading || !canApply}
              className="rounded-[var(--radius-md)] bg-[var(--accent)] px-3 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)] focus-ring disabled:opacity-50"
            >
              {loading ? '…' : 'Apply'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
