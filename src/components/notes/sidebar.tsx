import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { makeSelectNotebooksWithNotes } from '@/state/selectors/index.ts';
import { useActions } from '@/hooks/use-actions.ts';
import { useTypedSelector } from '@/hooks/use-typed-selector.ts';

export const Sidebar: React.FC = () => {
  const sidebarRef = useRef(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [newNoteTitles, setNewNoteTitles] = useState<{ [key: string]: string }>(
    {}
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
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
        className={`fixed top-0 left-0 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 backdrop-blur-lg shadow-lg transform transition-all duration-500 z-50 
    ${isCollapsed ? 'w-16' : 'w-72'} 
    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    h-screen flex flex-col `}
        //
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
            <div key={notebookId} className="group">
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
                  {notes.map((note) => (
                    <li
                      key={note.id}
                      className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-700 text-gray-700 dark:text-gray-300"
                      onClick={() =>
                        navigate(`/app/notebook/${notebookId}/note/${note.id}`)
                      }
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
          className={`mt-auto px-3 py-4 bg-gradient-to-t from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-t border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 transition-all duration-300 ${
            isCollapsed
              ? 'opacity-0 translate-y-4 pointer-events-none'
              : 'opacity-100 translate-y-0 pointer-events-auto'
          }`}
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
      </aside>
    </>
  );
};
