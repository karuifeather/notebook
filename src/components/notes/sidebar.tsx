import React, { useState } from 'react';

import { Note } from '@/state/index.ts';

interface SidebarProps {
  notes: Note[];
  onNoteSelect: (id: string) => void;
  onCreateNote: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  notes,
  onNoteSelect,
  onCreateNote,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside
      className={`relative  bg-gray-50 dark:bg-gray-800 shadow-lg transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-80'
      } flex flex-col rounded-lg overflow-hidden`}
    >
      <div
        className={`fixed top-24 bg-gray-50 dark:bg-gray-800 ${isCollapsed ? 'w-20' : 'w-80'} `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Notes
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
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
              />
            </div>
          </div>
        )}

        {/* New Note Button */}
        {!isCollapsed && (
          <div className="p-4">
            <button
              onClick={onCreateNote}
              className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition font-medium"
            >
              + New Note
            </button>
          </div>
        )}

        {/* Notes List */}
        <ul className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <li
                key={note.id}
                onClick={() => onNoteSelect(note.id as string)}
                className={`group flex items-center ${
                  isCollapsed ? 'justify-center' : 'justify-between'
                } p-2 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 transition`}
              >
                <div
                  className={`flex items-center ${
                    isCollapsed ? 'justify-center' : 'gap-2'
                  }`}
                >
                  <div
                    className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-md text-sm font-semibold"
                    aria-label={note.title}
                  >
                    {note.title.charAt(0).toUpperCase()}
                  </div>
                  {!isCollapsed && (
                    <span className="truncate text-gray-800 dark:text-gray-200 font-medium">
                      {note.title}
                    </span>
                  )}
                </div>
                {!isCollapsed && (
                  <i className="fas fa-chevron-right text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"></i>
                )}
              </li>
            ))
          ) : (
            <li className="text-gray-400 dark:text-gray-500 text-center text-sm">
              {isCollapsed ? '' : 'No notes found'}
            </li>
          )}
        </ul>
      </div>
    </aside>
  );
};
