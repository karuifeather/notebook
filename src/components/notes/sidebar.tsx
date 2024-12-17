import { useActions } from '@/hooks/use-actions.ts';
import { useTypedSelector } from '@/hooks/use-typed-selector.ts';
import { AppDispatch, Note } from '@/state/index.ts';
import { selectLastCreatedNoteId } from '@/state/selectors/index.ts';
import { stat } from 'fs';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  notebooks: Notebook[];
  onNotebookSelect: (id: string) => void;
}

interface Notebook {
  id: string;
  title: string;
  notes: Note[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  notebooks,
  onNotebookSelect,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newNoteTitles, setNewNoteTitles] = useState<{ [key: string]: string }>(
    {}
  );
  const navigate = useNavigate();
  const { addNote } = useActions();
  const [selectedNotebook, setSelectedNotebook] = useState<string | null>(null);
  const newNoteId = useTypedSelector((state) =>
    selectLastCreatedNoteId(state, selectedNotebook as string)
  );

  // Toggle folder expansion
  const toggleFolder = (id: string) => {
    setExpandedFolders((prev) =>
      prev.includes(id) ? prev.filter((folder) => folder !== id) : [...prev, id]
    );
  };

  // Filter notebooks and notes based on search query
  const filteredNotebooks = notebooks.map((notebook) => ({
    ...notebook,
    notes: notebook.notes.filter((note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  // Handle adding a new note
  const handleAddNote = async (notebookId: string) => {
    const title = newNoteTitles[notebookId];
    if (!title.trim()) return;

    addNote({
      title: newNoteTitles[notebookId],
      description: '',
      dependencies: [],
    });

    setSelectedNotebook(notebookId);
  };

  useEffect(() => {
    if (newNoteId) {
      navigate(`/app/notebook/${selectedNotebook}/notes/${newNoteId}`);
    }
  }, [newNoteId, navigate]);

  return (
    <aside
      className={`relative bg-gray-50 dark:bg-gray-800 shadow-lg transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-72'
      } flex flex-col rounded-lg overflow-hidden`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        {!isCollapsed && (
          <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            Notebooks
          </h1>
        )}
        <button
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none transition"
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
        <div className="p-4">
          <div className="relative">
            <i className="fas fa-search absolute left-4 top-3 text-gray-400 dark:text-gray-500"></i>
            <input
              type="text"
              placeholder="Search notebooks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
            />
          </div>
        </div>
      )}

      {/* Notebook List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredNotebooks.map((notebook) => (
          <div key={notebook.id}>
            {/* Notebook Folder */}
            <div className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800">
              <div
                className="flex items-center gap-2"
                onClick={() => toggleFolder(notebook.id)}
              >
                <i
                  className={`fas ${
                    expandedFolders.includes(notebook.id)
                      ? 'fa-folder-open'
                      : 'fa-folder'
                  } text-blue-500`}
                ></i>
                {!isCollapsed && (
                  <span className="text-gray-800 dark:text-gray-200 font-medium">
                    {notebook.title}
                  </span>
                )}
              </div>
              {!isCollapsed && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent toggling folder
                    setNewNoteTitles((prev) => ({
                      ...prev,
                      [notebook.id]: '',
                    }));
                  }}
                  className="p-1 text-blue-500 hover:text-blue-600 focus:outline-none transition"
                >
                  <i className="fas fa-plus"></i>
                </button>
              )}
            </div>

            {/* Notes in the Notebook */}
            {expandedFolders.includes(notebook.id) && (
              <ul className="ml-6 mt-2 space-y-1">
                {notebook.notes.map((note) => (
                  <li
                    key={note.id}
                    onClick={() =>
                      navigate(`/app/notebook/${notebook.id}/note/${note.id}`)
                    } // Navigate to note
                    className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 transition"
                  >
                    <i className="fas fa-file-alt text-gray-400"></i>
                    {!isCollapsed && (
                      <span className="text-gray-700 dark:text-gray-300">
                        {note.title}
                      </span>
                    )}
                  </li>
                ))}

                {/* New Note Input */}
                {newNoteTitles[notebook.id] !== undefined && (
                  <li className="flex items-center gap-2 p-2">
                    <i className="fas fa-file-alt text-gray-400"></i>
                    <input
                      type="text"
                      value={newNoteTitles[notebook.id]}
                      onChange={(e) =>
                        setNewNoteTitles((prev) => ({
                          ...prev,
                          [notebook.id]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddNote(notebook.id);
                        }
                      }}
                      placeholder="New note title..."
                      className="w-full px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
                    />
                  </li>
                )}
              </ul>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};
