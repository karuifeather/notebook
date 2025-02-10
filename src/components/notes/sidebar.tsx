import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { makeSelectNotebooksWithNotes } from '@/state/selectors/index.ts';
import { useActions } from '@/hooks/use-actions.ts';
import { useTypedSelector } from '@/hooks/use-typed-selector.ts';
import { Note } from '@/state/index.ts';
import Modal from '../modal.tsx';
import { SidebarItem } from '../ui/SidebarItem.tsx';

const EXPANDED_STORAGE_KEY = 'sidebar-expanded-folders';

type SortOption = 'az' | 'lastEdited';

function loadExpandedFolders(): string[] {
  try {
    const raw = localStorage.getItem(EXPANDED_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      return Array.isArray(parsed)
        ? parsed.filter((x) => typeof x === 'string')
        : [];
    }
  } catch {
    // ignore
  }
  return [];
}

function saveExpandedFolders(ids: string[]) {
  try {
    localStorage.setItem(EXPANDED_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

export const Sidebar: React.FC = () => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedFolders, setExpandedFoldersState] = useState<string[]>(() =>
    loadExpandedFolders()
  );
  const [newNoteTitles, setNewNoteTitles] = useState<Record<string, string>>(
    {}
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('az');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    target: {
      type: 'notebook' | 'note';
      id: string;
      title?: string;
      parentId?: string;
    };
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: string;
    id: string;
    title?: string;
    parentId?: string;
  } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const contextMenuRef = useRef<HTMLDivElement | null>(null);
  const lastNotebookClickRef = useRef<{ id: string; time: number } | null>(
    null
  );

  const location = useLocation();
  const navigate = useNavigate();
  const { createNote, deleteNotebook, deleteNote } = useActions();

  const selectNotebooksWithNotes = makeSelectNotebooksWithNotes();
  const notebooks = useTypedSelector(selectNotebooksWithNotes);

  const currentNotebookId =
    location.pathname.match(/\/notebook\/([^/]+)/)?.[1] ?? null;
  const currentNoteId = location.pathname.match(/\/note\/([^/]+)/)?.[1] ?? null;

  const filteredAndSortedNotebooks = useMemo(() => {
    // Exclude playground — it's a try-out space, not a user notebook
    let list = notebooks.filter((nb) => nb.id !== 'playground');
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (nb) =>
          nb.name?.toLowerCase().includes(q) ||
          nb.notes?.some((n: Note) => n.title?.toLowerCase().includes(q))
      );
    }
    if (sortBy === 'az') {
      list = [...list].sort((a, b) =>
        (a.name || '').localeCompare(b.name || '')
      );
    } else {
      list = [...list].sort((a, b) =>
        (a.name || '').localeCompare(b.name || '')
      );
    }
    return list;
  }, [notebooks, searchQuery, sortBy]);

  const setExpandedFolders = useCallback(
    (updater: (prev: string[]) => string[]) => {
      setExpandedFoldersState((prev) => {
        const next = updater(prev);
        saveExpandedFolders(next);
        return next;
      });
    },
    []
  );

  // Auto-expand folder that contains the currently open note (route unchanged)
  useEffect(() => {
    if (!currentNotebookId || !currentNoteId) return;
    setExpandedFoldersState((prev) => {
      if (prev.includes(currentNotebookId)) return prev;
      const next = [...prev, currentNotebookId];
      saveExpandedFolders(next);
      return next;
    });
  }, [currentNotebookId, currentNoteId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('[aria-label="Toggle Sidebar"]')
      ) {
        setIsMobileOpen(false);
        setIsCollapsed(true);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddNote = (notebookId: string) => {
    const title = newNoteTitles[notebookId]?.trim();
    if (!title) return;
    createNote(notebookId, { title, description: '', dependencies: [] });
    setNewNoteTitles((prev) => ({ ...prev, [notebookId]: '' }));
  };

  const toggleFolder = (id: string) => {
    setExpandedFolders((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleNotebookRowClick = (notebookId: string) => {
    const now = Date.now();
    const last = lastNotebookClickRef.current;
    if (last?.id === notebookId && now - last.time < 400) {
      lastNotebookClickRef.current = null;
      return;
    }
    lastNotebookClickRef.current = { id: notebookId, time: now };
    toggleFolder(notebookId);
  };

  const handleNotebookRowDoubleClick = (notebookId: string) => {
    lastNotebookClickRef.current = null;
    navigate(`/app/notebook/${notebookId}`);
  };

  const handleFolderKeyDown = (e: React.KeyboardEvent, notebookId: string) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggleFolder(notebookId);
    }
  };

  const handleContextMenu = (
    event: React.MouseEvent<Element>,
    target: {
      type: 'notebook' | 'note';
      id: string;
      title?: string;
      parentId?: string;
    }
  ) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, target });
  };

  const handleDelete = () => {
    if (!deleteTarget) {
      setShowDeleteModal(false);
      setDeleteTarget(null);
      return;
    }
    if (deleteTarget.type === 'notebook') {
      deleteNotebook(deleteTarget.id);
      navigate('/app');
    } else {
      const parentId = deleteTarget.parentId ?? currentNotebookId;
      if (parentId) {
        deleteNote(parentId, deleteTarget.id);
        if (currentNoteId === deleteTarget.id) {
          navigate(`/app/notebook/${parentId}`);
        }
      }
    }
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target as Node)
      ) {
        setContextMenu(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <>
      {contextMenu && (
        <div
          ref={contextMenuRef}
          className="absolute z-[60] w-40 rounded-md border border-border bg-surface py-1 shadow-lg"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={() => setContextMenu(null)}
        >
          <button
            className="w-full px-4 py-2 text-left text-sm text-fg transition-colors duration-fast hover:bg-surface2"
            onClick={() => {
              setDeleteTarget(contextMenu.target);
              setShowDeleteModal(true);
            }}
          >
            Delete
          </button>
        </div>
      )}

      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <button
        className="fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-surface2 text-icon shadow-lg transition-transform duration-fast hover:bg-surface hover:text-fg hover:scale-105 active:scale-95 focus-ring md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle Sidebar"
      >
        <i className="fas fa-bars text-lg" />
      </button>

      <aside
        ref={sidebarRef}
        className={`workspace-sidebar z-50 fixed left-0 top-0 flex h-screen flex-col border-r border-border bg-surface transition-[width] duration-[200ms] ease-out md:relative md:left-0 ${isCollapsed ? 'w-[64px]' : 'w-[280px]'} ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        aria-label="Workspace sidebar"
      >
        <div className="flex h-full w-full flex-col min-w-0">
          {/* Header: Workspace + New + Collapse — sticky so it stays fixed when scrolling sidebar content */}
          <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between gap-2 border-b border-border bg-surface px-3 py-2.5">
            {!isCollapsed && (
              <>
                <Link
                  to="/"
                  className="min-w-0 truncate text-2xl font-bold text-fg no-underline hover:text-accent transition-colors"
                  style={{ fontSize: 'clamp(1.25rem, 2vw, 1.75rem)' }}
                >
                  Workspace
                </Link>
                <div className="flex items-center gap-1">
                  <button
                    className="flex h-8 items-center justify-center rounded-lg bg-surface2 text-icon transition-colors duration-fast hover:bg-surface hover:text-fg focus-ring"
                    onClick={() => navigate('/app/create-notebook')}
                    aria-label="Create New Notebook"
                  >
                    <i className="fas fa-plus" />
                  </button>
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface2 text-icon transition-colors duration-fast hover:bg-surface hover:text-fg focus-ring"
                    onClick={() => setIsCollapsed(true)}
                    aria-label="Collapse Sidebar"
                  >
                    <i className="fas fa-chevron-left" />
                  </button>
                </div>
              </>
            )}
            {isCollapsed && (
              <div className="flex w-full flex-col items-center gap-1 py-1">
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface2 text-icon hover:bg-surface hover:text-fg focus-ring"
                  onClick={() => setIsCollapsed(false)}
                  aria-label="Expand Sidebar"
                  title="Expand sidebar"
                >
                  <i className="fas fa-chevron-right" />
                </button>
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface2 text-icon focus-ring hover:bg-surface hover:text-fg"
                  onClick={() => navigate('/app/create-notebook')}
                  aria-label="New Notebook"
                  title="New notebook"
                >
                  <i className="fas fa-plus" />
                </button>
              </div>
            )}
          </div>

          {/* Scrollable area: search + sort + notebook list (header stays fixed above) */}
          <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0 flex flex-col">
            {!isCollapsed && (
              <div className="shrink-0 border-b border-border bg-surface px-3 py-2">
                <div className="relative">
                  <i
                    className="fas fa-search absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-icon"
                    aria-hidden
                  />
                  <input
                    type="search"
                    placeholder="Search notebooks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface2 py-2 pl-9 pr-3 text-sm text-fg placeholder-muted transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)]"
                    aria-label="Search notebooks"
                  />
                </div>
                <div className="mt-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full rounded-lg border border-border bg-surface2 py-1.5 pl-2 pr-7 text-xs text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)]"
                    aria-label="Sort notebooks"
                  >
                    <option value="az">A–Z</option>
                    <option value="lastEdited">Last edited</option>
                  </select>
                </div>
              </div>
            )}

            {/* Notebook list (tree) — inside same scroll area as search/filter */}
            <div className="px-2 py-2">
              {filteredAndSortedNotebooks.length === 0 && isCollapsed ? (
                /* Collapsed empty state: icon-only create, no long text */
                <div className="flex flex-col items-center justify-center py-6">
                  <button
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface2 text-icon hover:bg-surface hover:text-fg focus-ring"
                    onClick={() => navigate('/app/create-notebook')}
                    aria-label="Create notebook"
                    title="Create notebook"
                  >
                    <i className="fas fa-plus" />
                  </button>
                  <p className="mt-2 text-[10px] text-muted text-center leading-tight max-w-[56px]">
                    No notebooks
                  </p>
                </div>
              ) : filteredAndSortedNotebooks.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-3 py-8 text-center">
                  <p className="text-sm text-muted">
                    {searchQuery
                      ? 'No notebooks match your search.'
                      : 'No notebooks yet.'}
                  </p>
                  {!searchQuery && (
                    <button
                      className="mt-3 rounded-lg bg-surface2 px-4 py-2 text-sm font-medium text-fg transition-colors hover:bg-surface focus-ring"
                      onClick={() => navigate('/app/create-notebook')}
                    >
                      Create notebook
                    </button>
                  )}
                </div>
              ) : isCollapsed ? (
                /* Collapsed: icon-only with tooltips and active accent */
                <ul
                  className="flex flex-col items-center gap-0.5 py-2"
                  role="tree"
                  aria-label="Workspace"
                >
                  {filteredAndSortedNotebooks.map(
                    ({ notes, id: notebookId, name: notebookTitle }) => {
                      const isExpanded = expandedFolders.includes(notebookId);
                      const containsActiveNote =
                        currentNotebookId === notebookId &&
                        (currentNoteId
                          ? notes.some((n: Note) => n.id === currentNoteId)
                          : true);
                      return (
                        <li
                          key={notebookId}
                          className="relative flex w-full justify-center"
                          role="treeitem"
                          aria-expanded={isExpanded}
                          aria-label={notebookTitle || 'Untitled notebook'}
                        >
                          {containsActiveNote && (
                            <span
                              className="sidebar-collapsed-active-accent"
                              aria-hidden
                            />
                          )}
                          <SidebarItem
                            icon={
                              <i
                                className={`fas ${isExpanded ? 'fa-folder-open' : 'fa-folder'}`}
                              />
                            }
                            title={notebookTitle || 'Untitled'}
                            compact
                            titleAttr={`${notebookTitle || 'Untitled'} (double-click to open)`}
                            isActive={containsActiveNote}
                            onClick={() => handleNotebookRowClick(notebookId)}
                            onDoubleClick={() =>
                              handleNotebookRowDoubleClick(notebookId)
                            }
                            ariaExpanded={isExpanded}
                            onKeyDown={(e) =>
                              handleFolderKeyDown(e, notebookId)
                            }
                            tabIndex={0}
                          />
                        </li>
                      );
                    }
                  )}
                </ul>
              ) : (
                <ul className="space-y-0.5" role="tree" aria-label="Workspace">
                  {filteredAndSortedNotebooks.map(
                    ({ notes, id: notebookId, name: notebookTitle }) => {
                      const isExpanded = expandedFolders.includes(notebookId);
                      return (
                        <li
                          key={notebookId}
                          className="group/list"
                          role="treeitem"
                          aria-expanded={isExpanded}
                          aria-label={notebookTitle || 'Untitled notebook'}
                        >
                          <div
                            onContextMenu={(e) =>
                              handleContextMenu(e, {
                                type: 'notebook',
                                id: notebookId,
                                title: notebookTitle,
                              })
                            }
                            className="group/row flex items-stretch rounded-lg"
                          >
                            <div
                              role="treeitem"
                              tabIndex={0}
                              onClick={() => handleNotebookRowClick(notebookId)}
                              onDoubleClick={() =>
                                handleNotebookRowDoubleClick(notebookId)
                              }
                              onKeyDown={(e) =>
                                handleFolderKeyDown(e, notebookId)
                              }
                              aria-label={
                                isExpanded ? 'Collapse folder' : 'Expand folder'
                              }
                              title="Double-click to open notebook"
                              aria-expanded={isExpanded}
                              className={`flex h-[42px] min-h-[42px] w-full cursor-pointer items-center gap-3 rounded-[14px] border px-3 text-left transition-all duration-[150ms] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] ${
                                currentNotebookId === notebookId &&
                                !currentNoteId
                                  ? 'border border-border border-l-[3px] border-l-accent bg-surface2 text-fg [--icon-color:var(--icon-active)]'
                                  : 'border-border bg-surface2 hover:bg-surface active:bg-surface text-fg [--icon-color:var(--icon)]'
                              }`}
                              style={{ paddingLeft: 'var(--space-3)' }}
                            >
                              <i
                                className={`fas fa-chevron-right text-xs transition-transform duration-[180ms] group-hover/row:text-fg ${isExpanded ? 'rotate-90' : ''}`}
                                style={{
                                  color: 'var(--icon-color, var(--icon))',
                                }}
                              />
                              <span
                                className="flex h-8 w-8 shrink-0 items-center justify-center group-hover/row:text-fg"
                                style={{
                                  color: 'var(--icon-color, var(--icon))',
                                }}
                              >
                                <i
                                  className={`fas ${isExpanded ? 'fa-folder-open' : 'fa-folder'}`}
                                />
                              </span>
                              <span className="min-w-0 flex-1 truncate text-sm font-medium">
                                {notebookTitle || 'Untitled'}
                              </span>
                              <button
                                type="button"
                                className="shrink-0 rounded p-1 text-icon opacity-0 transition-opacity duration-fast group-hover/row:opacity-100 hover:bg-surface hover:text-fg focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)]"
                                aria-label="Notebook options"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleContextMenu(
                                    e as unknown as React.MouseEvent<Element>,
                                    {
                                      type: 'notebook',
                                      id: notebookId,
                                      title: notebookTitle,
                                    }
                                  );
                                }}
                              >
                                <i className="fas fa-ellipsis-v text-xs" />
                              </button>
                            </div>
                          </div>

                          <div
                            className={`sidebar-folder-content overflow-hidden ${isExpanded ? 'max-h-[2000px]' : 'max-h-0'}`}
                          >
                            <div className="ml-2 border-l border-border pl-3 pt-0.5 pb-1">
                              <div className="flex items-center gap-2 rounded-[12px] border border-dashed border-border bg-transparent py-1.5 pl-2.5 pr-2 transition-colors hover:bg-surface2/80 focus-within:border-border focus-within:bg-surface2">
                                <i
                                  className="fas fa-plus text-xs text-icon shrink-0"
                                  aria-hidden
                                />
                                <input
                                  type="text"
                                  value={newNoteTitles[notebookId] ?? ''}
                                  onChange={(e) =>
                                    setNewNoteTitles((prev) => ({
                                      ...prev,
                                      [notebookId]: e.target.value,
                                    }))
                                  }
                                  onKeyDown={(e) =>
                                    e.key === 'Enter' &&
                                    handleAddNote(notebookId)
                                  }
                                  placeholder="New note…"
                                  className="flex-1 min-w-0 border-0 bg-transparent px-1 py-0.5 text-sm text-fg placeholder-muted focus:outline-none focus:ring-0"
                                  aria-label="New note title"
                                />
                              </div>
                              {notes.length === 0 ? (
                                <div className="py-3 pl-2 text-center">
                                  <p className="text-xs text-muted">
                                    No notes yet
                                  </p>
                                  <p className="mt-1 text-xs text-accent">
                                    Type above and press Enter to add one
                                  </p>
                                </div>
                              ) : (
                                <ul className="space-y-0.5" role="group">
                                  {notes.map((note: Note) => (
                                    <li key={note.id} role="treeitem">
                                      <SidebarItem
                                        to={`/app/notebook/${notebookId}/note/${note.id}`}
                                        icon={<i className="fas fa-file-alt" />}
                                        title={note.title || 'Untitled'}
                                        isActive={
                                          currentNotebookId === notebookId &&
                                          currentNoteId === note.id
                                        }
                                        onContextMenu={(e) => {
                                          e.stopPropagation();
                                          handleContextMenu(e, {
                                            type: 'note',
                                            id: note.id as string,
                                            title: note.title,
                                            parentId: notebookId,
                                          });
                                        }}
                                        actions={
                                          <button
                                            type="button"
                                            className="rounded p-1 text-icon hover:bg-surface hover:text-fg focus-ring"
                                            aria-label="Note options"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              handleContextMenu(
                                                e as unknown as React.MouseEvent<Element>,
                                                {
                                                  type: 'note',
                                                  id: note.id as string,
                                                  title: note.title,
                                                  parentId: notebookId,
                                                }
                                              );
                                            }}
                                          >
                                            <i className="fas fa-ellipsis-v text-xs" />
                                          </button>
                                        }
                                      />
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        </li>
                      );
                    }
                  )}
                </ul>
              )}
            </div>
          </div>

          {/* Footer: subtle branding */}
          {!isCollapsed && (
            <div className="mt-auto border-t border-border px-3 py-2 text-center">
              <p className="text-[11px] text-muted/90">FeatherPad</p>
            </div>
          )}
        </div>

        {showDeleteModal && (
          <Modal
            title="Confirm Delete"
            onConfirm={handleDelete}
            onCancel={() => setShowDeleteModal(false)}
          >
            <p className="text-fg">
              Are you sure you want to delete{' '}
              <strong>{deleteTarget?.title}</strong>?{' '}
              {deleteTarget?.type === 'notebook' &&
                'Everything inside will be deleted.'}
            </p>
          </Modal>
        )}
      </aside>
    </>
  );
};
