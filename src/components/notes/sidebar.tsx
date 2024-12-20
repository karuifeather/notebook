import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { makeSelectNotebooksWithNotes } from '@/state/selectors/index.ts';
import { useActions } from '@/hooks/use-actions.ts';
import { useTypedSelector } from '@/hooks/use-typed-selector.ts';
import { Note } from '@/state/index.ts';
import Modal from '../modal.tsx';

export const Sidebar: React.FC = () => {
  const sidebarRef = useRef(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [newNoteTitles, setNewNoteTitles] = useState<{ [key: string]: string }>(
    {}
  );
  // const [searchQuery, setSearchQuery] = useState('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Context Menu for Delete
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    target: { type: string; id: string };
  } | null>(null); // Tracks right-click context menu position
  const [deleteTarget, setDeleteTarget] = useState<{
    type: string;
    id: string;
    title?: string;
  } | null>(null); // Tracks the item to delete (notebook/note)
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Tracks whether delete modal is open
  const contextMenuRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();
  const { createNote } = useActions();

  const selectNotebooksWithNotes = makeSelectNotebooksWithNotes();
  const notebooks = useTypedSelector(selectNotebooksWithNotes);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        sidebarRef.current &&
        // @ts-ignore
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest('[aria-label="Toggle Sidebar"]') // Exclude toggle button
      ) {
        setIsCollapsed(true); // Collapse sidebar
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsCollapsed]);

  const handleAddNote = (notebookId: string) => {
    const title = newNoteTitles[notebookId]?.trim();
    if (!title) return;

    createNote(notebookId, { title, description: '', dependencies: [] });
    setNewNoteTitles((prev) => ({ ...prev, [notebookId]: '' }));
  };

  const toggleFolder = (id: string) => {
    setExpandedFolders((prev) =>
      prev.includes(id) ? prev.filter((folder) => folder !== id) : [...prev, id]
    );
  };

  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);

  // Context menu handlers
  const handleContextMenu = <T extends HTMLElement>(
    event: React.MouseEvent<T>,
    target: { type: 'notebook' | 'note'; id: string; title?: string }
  ) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      target,
    });
  };

  const handleDelete = () => {
    if (deleteTarget) {
      if (deleteTarget.type === 'notebook') {
        console.log(`Notebook deleted: ${deleteTarget.id}`);
      } else {
        console.log(`Note deleted: ${deleteTarget.id}`);
      }
    }
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  // Close the context menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target as Node)
      ) {
        handleCloseContextMenu();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <>
      {/* Context Menu */}
      {contextMenu && (
        <div
          ref={contextMenuRef}
          className="absolute z-[60] bg-white dark:bg-gray-800 shadow-lg rounded-md py-2 w-40"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={handleCloseContextMenu}
        >
          <button
            className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => {
              setDeleteTarget(contextMenu.target);
              setShowDeleteModal(true);
            }}
          >
            Delete
          </button>
        </div>
      )}
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="fixed top-3 left-3 inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMobileSidebar}
          aria-hidden="true"
        />
      )}

      {/* Mobile Toggle Button */}
      <button
        className="p-3 rounded-full shadow-lg md:hidden text-white fixed top-4 left-4 sm:top-6 z-50 bg-gradient-to-r from-blue-500 to-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800 transition-transform transform hover:scale-110 active:scale-95"
        onClick={toggleMobileSidebar}
        aria-label="Toggle Sidebar"
      >
        <i className="fas fa-bars text-lg"></i>
      </button>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`z-50 fixed sm:top-8 left-0 sm:left-3 sm:h-[50rem] h-[100vh] rounded-lg overflow-hidden sm:relative bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 backdrop-blur-lg sm:shadow-black shadow-lg sm:shadow-xl transform transition-all duration-300
    ${isCollapsed ? 'w-16' : 'w-72'} 
    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
     flex flex-col`}
      >
        <div
          className={`h-screen sm:h-full flex flex-col ${isCollapsed ? 'w-16' : 'w-72'} 
    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md">
            {!isCollapsed && (
              <>
                <Link to="/">
                  <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                    Notebooks
                  </h1>
                </Link>
                {/* Create Button */}
                <div className={`${isCollapsed ? 'hidden' : 'block'}`}>
                  <button
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white  bg-blue-500 hover:bg-blue-600 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    onClick={() => navigate('/app/create-notebook')}
                    aria-label="Create New Notebook"
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </>
            )}
            <button
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              <i
                className={`fas ${
                  isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'
                }`}
              ></i>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
            {notebooks.map(({ notes, id: notebookId, name: notebookTitle }) => (
              <div
                key={notebookId}
                className="group relative"
                onContextMenu={(e) => {
                  e.preventDefault(); // Prevent browser's default context menu
                  handleContextMenu(e, {
                    type: 'notebook',
                    id: notebookId,
                    title: notebookTitle,
                  });
                }}
              >
                <Link to={`/app/notebook/${notebookId}`}>
                  <div
                    className="flex items-center justify-between cursor-pointer p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-700 transition"
                    onClick={() => toggleFolder(notebookId)}
                    aria-expanded={expandedFolders.includes(notebookId)}
                  >
                    <div className="flex items-center gap-2">
                      <i
                        className={`fas ${
                          expandedFolders.includes(notebookId)
                            ? 'fa-folder-open'
                            : 'fa-folder'
                        } text-blue-500`}
                      ></i>
                      {!isCollapsed && (
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {notebookTitle}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>

                {/* Notes */}
                <div
                  className={`transition-max-height duration-300 overflow-hidden ${
                    expandedFolders.includes(notebookId)
                      ? 'max-h-screen'
                      : 'max-h-0'
                  }`}
                >
                  <ul className="ml-5 mt-2 space-y-2">
                    <li className="flex items-center gap-2">
                      <i className="fas fa-plus text-gray-400"></i>
                      <input
                        type="text"
                        value={newNoteTitles[notebookId] || ''}
                        onChange={(e) =>
                          setNewNoteTitles((prev) => ({
                            ...prev,
                            [notebookId]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) =>
                          e.key === 'Enter' && handleAddNote(notebookId)
                        }
                        placeholder="New note title..."
                        className="flex-1 px-2 py-1 text-sm bg-white/50 dark:bg-gray-800/50 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </li>
                    {notes.map((note: Note) => (
                      <li
                        key={note.id}
                        className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-700 text-gray-700 dark:text-gray-300"
                        onClick={() =>
                          navigate(
                            `/app/notebook/${notebookId}/note/${note.id}`
                          )
                        }
                        onContextMenu={(e) => {
                          e.stopPropagation(); // Prevent event from reaching the parent notebook
                          handleContextMenu(e, {
                            type: 'note',
                            id: note.id as string,
                            title: note.title,
                          });
                        }}
                      >
                        <i className="fas fa-file-alt text-gray-400"></i>
                        {!isCollapsed && (
                          <span className="text-sm">{note.title}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            className={`mt-auto px-3 py-4 bg-gradient-to-t from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800 border-t border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 transition-all duration-300`}
          >
            {!isCollapsed && (
              <div className="text-center space-y-2">
                <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                  Unfeathered
                </h2>
                <p className="text-sm leading-relaxed">
                  Breaking Limits, Building Futures.
                </p>
              </div>
            )}
          </div>
        </div>
        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <Modal
            title="Confirm Delete"
            onConfirm={handleDelete}
            onCancel={() => setShowDeleteModal(false)}
          >
            <p className="text-gray-700 dark:text-gray-300">
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
