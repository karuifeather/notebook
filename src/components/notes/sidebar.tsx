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

  const navigate = useNavigate();
  const { createNote } = useActions();

  const selectNotebooksWithNotes = makeSelectNotebooksWithNotes();

  // 1. Select all notebooks
  const notebooks = useTypedSelector(selectNotebooksWithNotes);

  // 2. Precompute notes for all notebooks at the top level

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

  return (
    <aside
      className={`relative bg-gray-50 dark:bg-gray-900 shadow-lg transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-80'
      } flex flex-col rounded-lg overflow-hidden`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700">
        {!isCollapsed && (
          <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            My Notebooks
          </h1>
        )}
        <button
          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <i
            className={`fas ${
              isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'
            } text-gray-600 dark:text-gray-400`}
          ></i>
        </button>
      </div>

      {/* Search Bar */}
      {!isCollapsed && (
        <div className="p-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search notebooks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <i className="fas fa-search absolute left-3 top-2.5 text-gray-400"></i>
          </div>
        </div>
      )}

      {/* Notebook List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        {notebooks.map(({ notes, id: notebookId, name: notebookTitle }) => {
          return (
            <div key={notebookId} className="group">
              {/* Notebook Folder */}
              <div
                className="flex items-center justify-between cursor-pointer p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
                onClick={() => toggleFolder(notebookId)}
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
                {!isCollapsed && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setNewNoteTitles((prev) => ({
                        ...prev,
                        [notebookId]: '',
                      }));
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-blue-500 hover:text-blue-600 transition"
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                )}
              </div>

              {/* Notes List */}
              {expandedFolders.includes(notebookId) && (
                <ul className="ml-5 mt-1 space-y-1">
                  {notes.map((note) => (
                    <li
                      key={note.id}
                      className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                      onClick={() =>
                        navigate(`/app/notebook/${notebookId}/note/${note.id}`)
                      }
                    >
                      <i className="fas fa-file-alt text-gray-400"></i>
                      {!isCollapsed && (
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {note.title}
                        </span>
                      )}
                    </li>
                  ))}

                  {/* New Note Input */}
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
                      className="flex-1 px-2 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </li>
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
