import React, { useEffect, useRef, useState } from 'react';
import { useActions } from '@/hooks/use-actions.ts';

interface AddCellProps {
  currentCellId: string | null;
}

const AddCell: React.FC<AddCellProps> = ({ currentCellId }) => {
  const { insertCellAfter } = useActions();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div className="relative flex items-center justify-center">
      {/* Floating Add Button */}
      <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Add new cell">
        <i className="fas fa-plus text-lg"></i>
      </button>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute top-14 sm:top-16 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-56 z-50 animate-fade-in"
        >
          <ul className="py-2">
            {/* Code Block */}
            <li>
              <button
                onClick={() => {
                  insertCellAfter(currentCellId, 'code');
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition"
              >
                <i className="fas fa-code text-blue-500"></i>
                <span className="text-sm font-medium">Code Block</span>
              </button>
            </li>

            {/* Text Block */}
            <li>
              <button
                onClick={() => {
                  insertCellAfter(currentCellId, 'text');
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition"
              >
                <i className="fas fa-font text-green-500"></i>
                <span className="text-sm font-medium">Text Block</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AddCell;
