import { useActions } from '@/hooks/use-actions.ts';
import { useTypedSelector } from '@/hooks/use-typed-selector.ts';
import { selectLastGeneratedId } from '@/state/selectors/index.ts';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DocumentCanvas } from '../ui/DocumentCanvas';
import './styles/create-notebook.scss';

const EXAMPLE_NAMES = ['Study', 'Projects', 'Ideas', 'Journal'];

const CreateNotebook: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { createNotebook } = useActions();
  const lastGenerateId = useTypedSelector(selectLastGeneratedId);

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      const t = title.trim();
      if (!t || isSubmitting) return;
      setTouched(true);
      setIsSubmitting(true);
      createNotebook(t, description.trim());
    },
    [title, description, isSubmitting, createNotebook]
  );

  useEffect(() => {
    if (isSubmitting && lastGenerateId) {
      navigate(`/app/notebook/${lastGenerateId}`);
    }
  }, [isSubmitting, lastGenerateId, navigate]);

  const showNameError = touched && !title.trim();
  const canSubmit = !!title.trim() && !isSubmitting;

  const handleKeyDownName = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleKeyDownDescription = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <DocumentCanvas className="document-canvas--create">
      <div className="create-notebook">
        <header className="create-notebook__header">
          <h1 className="create-notebook__title">New notebook</h1>
          <p className="create-notebook__subtitle">
            Give it a name. You can add details later.
          </p>
        </header>

        <form
          className="create-notebook__form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="create-notebook__field">
            <label
              htmlFor="create-notebook-name"
              className="create-notebook__label"
            >
              Name
            </label>
            <input
              ref={nameInputRef}
              id="create-notebook-name"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setTouched(true)}
              onKeyDown={handleKeyDownName}
              placeholder="Notebook name"
              autoFocus
              autoComplete="off"
              aria-invalid={showNameError}
              aria-describedby={
                showNameError ? 'create-notebook-name-error' : undefined
              }
              className="create-notebook__input"
            />
            {showNameError && (
              <p
                id="create-notebook-name-error"
                className="create-notebook__error"
                role="alert"
              >
                Name is required
              </p>
            )}
          </div>

          <div className="create-notebook__field">
            <label
              htmlFor="create-notebook-desc"
              className="create-notebook__label"
            >
              Description
            </label>
            <textarea
              id="create-notebook-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleKeyDownDescription}
              placeholder="Add a short description (optional)"
              rows={4}
              className="create-notebook__textarea"
              aria-describedby="create-notebook-desc-helper"
            />
            <p
              id="create-notebook-desc-helper"
              className="create-notebook__helper"
            >
              Optional
            </p>
          </div>

          <div className="create-notebook__examples">
            <span className="create-notebook__examples-label">Examples:</span>
            <div className="create-notebook__chips">
              {EXAMPLE_NAMES.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setTitle(name)}
                  className="create-notebook__chip"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          <div className="create-notebook__actions">
            <button
              type="submit"
              disabled={!canSubmit}
              className="create-notebook__btn-primary"
            >
              {isSubmitting ? 'Creating…' : 'Create notebook'}
            </button>
            <Link to="/app" className="create-notebook__btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </DocumentCanvas>
  );
};

export default CreateNotebook;
