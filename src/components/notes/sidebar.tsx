import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { makeSelectNotebooksWithNotes } from '@/state/selectors/index.ts';
import { useActions } from '@/hooks/use-actions.ts';
import { useTypedSelector } from '@/hooks/use-typed-selector.ts';

export const Sidebar: React.FC = () => {
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

      <button
        className="p-2 rounded-lg md:hidden text-gray-500 dark:text-gray-300 fixed top-16 left-2 sm:top-20 z-50 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        onClick={toggleMobileSidebar}
        aria-label="Toggle Sidebar"
      >
        <i className="fas fa-bars"></i>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 backdrop-blur-lg shadow-lg transform transition-all duration-500 z-50 ${
          isCollapsed ? 'w-16' : 'w-72'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
        h-screen flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md">
          {!isCollapsed && (
            <h1 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100">
              Notebooks
            </h1>
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

        {/* Search */}
        {!isCollapsed && (
          <div className="p-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search notebooks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm bg-white/50 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <i className="fas fa-search absolute left-3 top-2.5 text-gray-400"></i>
            </div>
          </div>
        )}

        {/* Notebooks */}
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
              {expandedFolders.includes(notebookId) && (
                <ul className="ml-5 mt-2 space-y-2">
                  {/* Add Note */}
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
              )}
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};
