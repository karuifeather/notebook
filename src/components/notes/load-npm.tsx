import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useActions } from '@/hooks/use-actions.ts';
import { useTypedSelector } from '@/hooks/use-typed-selector.ts';
import { makeSelectFirstCodeCellId } from '@/state/selectors/index.ts';
import {
  resolvePinnedVersions,
  resolveVersion,
  fetchVersionList,
} from '@/bundler/resolve-versions.ts';
import { extractBareImports } from '@/bundler/imports.ts';
import { CODE_CELL_STARTER } from '@/constants/code-cell.ts';
import type { DepsLock } from '@/state/types/note.ts';
import './styles/load-npm.scss';

/** Default import snippet for known packages; otherwise import * as pkg from 'pkg'. */
function defaultImportLine(pkg: string): string {
  if (pkg === 'react') return "import React from 'react';";
  if (pkg === 'react-dom') return "import ReactDOM from 'react-dom/client';";
  const safe =
    pkg
      .replace(/@/g, '')
      .replace(/[/-]/g, '_')
      .replace(/[^a-zA-Z0-9_]/g, '') || 'pkg';
  const varName = /^\d/.test(safe) ? '_' + safe : safe;
  return `import * as ${varName} from '${pkg}';`;
}

/** Return true if code already imports this package (bare specifier). */
async function codeAlreadyImports(code: string, pkg: string): Promise<boolean> {
  const bare = await extractBareImports(code);
  return bare.has(pkg);
}

/** Dedupe and prepend import lines at top of code; avoid duplicates. */
async function prependImports(code: string, pkgs: string[]): Promise<string> {
  const toAdd: string[] = [];
  for (const pkg of pkgs) {
    const already = await codeAlreadyImports(code, pkg);
    if (!already) toAdd.push(defaultImportLine(pkg));
  }
  if (toAdd.length === 0) return code;
  const importBlock = toAdd.join('\n');
  const trimmed = code.trimStart();
  if (!trimmed) return importBlock + '\n\n';
  return importBlock + '\n\n' + code;
}

export interface LoadNpmModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  noteId: string;
  notebookId: string;
  /** Current depsLock so we can show "already pinned" and avoid re-pinning same. */
  depsLock?: DepsLock;
  /** Called after successful install with number of packages pinned (so parent can show toast). */
  onInstalled?: (pinnedCount: number) => void;
}

type VersionChoice = 'latest' | string;

const LoadNpmModuleModal: React.FC<LoadNpmModuleModalProps> = ({
  isOpen,
  onClose,
  noteId,
  notebookId,
  depsLock = {},
  onInstalled,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [versionChoice, setVersionChoice] = useState<
    Record<string, VersionChoice>
  >({});
  const [versionListOpen, setVersionListOpen] = useState<string | null>(null);
  const [versionLists, setVersionLists] = useState<Record<string, string[]>>(
    {}
  );
  const [versionListLoading, setVersionListLoading] = useState<string | null>(
    null
  );
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installError, setInstallError] = useState<string | null>(null);
  const [willPin, setWillPin] = useState<Record<string, string>>({});
  const [insertImports, setInsertImports] = useState(true);

  const { noteDepsLockMerge, updateCell, insertCellAfter, bundleIt } =
    useActions();
  const selectFirstCodeCellId = makeSelectFirstCodeCellId();
  const firstCodeCellId = useTypedSelector((state) =>
    selectFirstCodeCellId(state, noteId)
  );
  const cells = useTypedSelector((state) => state.cells?.[noteId]);
  const getCellContent = useCallback(
    (cellId: string) => cells?.data?.[cellId]?.content ?? '',
    [cells]
  );

  const fetchNpmModules = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearchLoading(true);
    try {
      const response = await axios.get(
        'https://registry.npmjs.org/-/v1/search',
        { params: { text: query.trim(), size: 10 } }
      );
      const modules = response.data.objects.map(
        (obj: { package: { name: string } }) => obj.package.name
      );
      setSearchResults(modules);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const t = setTimeout(() => fetchNpmModules(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery, fetchNpmModules]);

  const handleAddModule = (moduleName: string) => {
    if (!selectedModules.includes(moduleName)) {
      setSelectedModules((prev) => [...prev, moduleName]);
      setVersionChoice((prev) => ({ ...prev, [moduleName]: 'latest' }));
    }
  };

  const handleRemoveModule = (moduleName: string) => {
    setSelectedModules((prev) => prev.filter((m) => m !== moduleName));
    setVersionChoice((prev) => {
      const next = { ...prev };
      delete next[moduleName];
      return next;
    });
    setVersionListOpen((prev) => (prev === moduleName ? null : prev));
  };

  const openVersionDropdown = useCallback(
    async (pkg: string) => {
      setVersionListOpen((prev) => (prev === pkg ? null : pkg));
      if (versionLists[pkg]) return;
      setVersionListLoading(pkg);
      const { versions, error } = await fetchVersionList(pkg);
      setVersionListLoading(null);
      if (error) {
        setVersionLists((prev) => ({ ...prev, [pkg]: [] }));
        return;
      }
      setVersionLists((prev) => ({ ...prev, [pkg]: versions }));
    },
    [versionLists]
  );

  // Preview "Will pin" when selection or version choices change
  useEffect(() => {
    if (selectedModules.length === 0) {
      setWillPin({});
      return;
    }
    let cancelled = false;
    const run = async () => {
      const chosen: Record<string, string> = {};
      for (const pkg of selectedModules) {
        const choice = versionChoice[pkg] ?? 'latest';
        const result = await resolveVersion(
          pkg,
          choice === 'latest' ? undefined : choice
        );
        if (cancelled) return;
        if ('version' in result) chosen[pkg] = result.version;
      }
      if (!cancelled) setWillPin(chosen);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [selectedModules, versionChoice]);

  const handleInstall = useCallback(async () => {
    if (selectedModules.length === 0) {
      onClose();
      return;
    }
    setIsInstalling(true);
    setInstallError(null);
    try {
      const chosenVersions: Record<string, string> = {};
      for (const pkg of selectedModules) {
        const c = versionChoice[pkg] ?? 'latest';
        if (c !== 'latest') chosenVersions[pkg] = c;
      }
      const { resolved, errors } = await resolvePinnedVersions(
        selectedModules,
        Object.keys(chosenVersions).length > 0 ? chosenVersions : undefined
      );
      if (Object.keys(resolved).length === 0 && errors.length > 0) {
        setInstallError(errors.map((e) => `${e.pkg}: ${e.message}`).join('. '));
        setIsInstalling(false);
        return;
      }
      if (Object.keys(resolved).length > 0) {
        noteDepsLockMerge(notebookId, noteId, resolved);
      }
      if (errors.length > 0) {
        setInstallError(errors.map((e) => `${e.pkg}: ${e.message}`).join('. '));
      }

      if (insertImports && Object.keys(resolved).length > 0) {
        const pkgs = Object.keys(resolved);
        if (firstCodeCellId) {
          const currentContent = getCellContent(firstCodeCellId);
          const newContent = await prependImports(currentContent, pkgs);
          if (newContent !== currentContent) {
            updateCell(noteId, firstCodeCellId, newContent);
            bundleIt(firstCodeCellId, newContent, {
              noteId,
              parentId: notebookId,
            });
          }
        } else {
          const lines = pkgs.map((p) => defaultImportLine(p));
          insertCellAfter(
            noteId,
            null,
            'code',
            lines.join('\n') + '\n\n' + CODE_CELL_STARTER
          );
        }
      }

      const pinnedCount = Object.keys(resolved).length;
      if (pinnedCount > 0) onInstalled?.(pinnedCount);
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Install failed';
      setInstallError(msg);
    } finally {
      setIsInstalling(false);
    }
  }, [
    selectedModules,
    versionChoice,
    noteId,
    notebookId,
    insertImports,
    firstCodeCellId,
    getCellContent,
    noteDepsLockMerge,
    updateCell,
    insertCellAfter,
    bundleIt,
    onClose,
    onInstalled,
  ]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (versionListOpen) setVersionListOpen(null);
        else onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, versionListOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <>
      <div
        className="load-npm-modal load-npm-modal--dark"
        role="dialog"
        aria-modal="true"
        aria-labelledby="load-npm-title"
      >
        <div
          className="load-npm-modal__backdrop"
          onClick={handleBackdropClick}
          aria-hidden
        />
        <div className="load-npm-modal__panel">
          <header className="load-npm-modal__header">
            <h2 id="load-npm-title" className="load-npm-modal__title">
              Add NPM Module
            </h2>
            <button
              type="button"
              className="load-npm-modal__close"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          </header>

          <div className="load-npm-modal__body">
            <div className="load-npm-modal__grid">
              <div className="load-npm-modal__section">
                <label className="load-npm-modal__label">Search</label>
                <input
                  type="text"
                  placeholder="Search npm packages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="load-npm-modal__input"
                  autoFocus
                />
                <div className="load-npm-modal__results">
                  {isSearchLoading ? (
                    <p className="load-npm-modal__muted">Loading…</p>
                  ) : searchResults.length > 0 ? (
                    <ul className="load-npm-modal__list">
                      {searchResults.map((name) => (
                        <li key={name} className="load-npm-modal__list-item">
                          <span className="load-npm-modal__pkg-name">
                            {name}
                          </span>
                          <button
                            type="button"
                            className="load-npm-modal__btn add"
                            onClick={() => handleAddModule(name)}
                          >
                            Add
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="load-npm-modal__muted">
                      {searchQuery.trim() ? 'No results.' : 'Type to search.'}
                    </p>
                  )}
                </div>
              </div>

              <div className="load-npm-modal__section">
                <h3 className="load-npm-modal__label">Selected</h3>
                {selectedModules.length === 0 ? (
                  <p className="load-npm-modal__muted">None selected.</p>
                ) : (
                  <ul className="load-npm-modal__list">
                    {selectedModules.map((pkg) => (
                      <li
                        key={pkg}
                        className="load-npm-modal__list-item selected"
                      >
                        <div className="load-npm-modal__selected-row">
                          <span className="load-npm-modal__pkg-name">
                            {pkg}
                          </span>
                          <div className="load-npm-modal__version-row">
                            <button
                              type="button"
                              className="load-npm-modal__btn version"
                              onClick={() => openVersionDropdown(pkg)}
                              disabled={versionListLoading === pkg}
                            >
                              {versionChoice[pkg] === 'latest' ||
                              !versionChoice[pkg]
                                ? 'Pin latest'
                                : versionChoice[pkg]}
                              {versionListLoading === pkg ? ' …' : ''}
                            </button>
                            {versionListOpen === pkg && (
                              <div className="load-npm-modal__version-dropdown">
                                <button
                                  type="button"
                                  className="load-npm-modal__version-opt"
                                  onClick={() => {
                                    setVersionChoice((prev) => ({
                                      ...prev,
                                      [pkg]: 'latest',
                                    }));
                                    setVersionListOpen(null);
                                  }}
                                >
                                  Pin latest
                                </button>
                                {(versionLists[pkg] || []).map((v) => (
                                  <button
                                    key={v}
                                    type="button"
                                    className="load-npm-modal__version-opt"
                                    onClick={() => {
                                      setVersionChoice((prev) => ({
                                        ...prev,
                                        [pkg]: v,
                                      }));
                                      setVersionListOpen(null);
                                    }}
                                  >
                                    {v}
                                  </button>
                                ))}
                              </div>
                            )}
                            <button
                              type="button"
                              className="load-npm-modal__btn remove"
                              onClick={() => handleRemoveModule(pkg)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                {Object.keys(willPin).length > 0 && (
                  <div className="load-npm-modal__will-pin">
                    <h4 className="load-npm-modal__will-pin-title">Will pin</h4>
                    <ul className="load-npm-modal__will-pin-list">
                      {Object.entries(willPin).map(([pkg, ver]) => (
                        <li key={pkg}>
                          <code>{pkg}</code> → {ver}
                          {depsLock[pkg] === ver && (
                            <span className="load-npm-modal__already">
                              (already pinned)
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <label className="load-npm-modal__checkbox">
                  <input
                    type="checkbox"
                    checked={insertImports}
                    onChange={(e) => setInsertImports(e.target.checked)}
                  />
                  <span>Insert import statements into current code cell</span>
                </label>
              </div>
            </div>

            {installError && (
              <p className="load-npm-modal__error" role="alert">
                {installError}
              </p>
            )}
          </div>

          <footer className="load-npm-modal__footer">
            <button
              type="button"
              className="load-npm-modal__btn secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="load-npm-modal__btn primary"
              onClick={handleInstall}
              disabled={selectedModules.length === 0 || isInstalling}
            >
              {isInstalling ? 'Adding…' : 'Add / Install'}
            </button>
          </footer>
        </div>
      </div>
    </>
  );
};

export default LoadNpmModuleModal;
