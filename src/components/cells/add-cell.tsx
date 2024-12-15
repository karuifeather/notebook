import React, { useState } from 'react';
import { useActions } from '@/hooks/use-actions.ts';

interface AddCellProps {
  currentCellId: string | null;
}

const AddCell: React.FC<AddCellProps> = ({ currentCellId }) => {
  const { insertCellAfter } = useActions();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative flex items-center">
      {/* Main Add Button */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Add new cell"
        >
          <i className="fas fa-plus"></i>
        </button>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="absolute top-14 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg w-48 z-50">
            <ul className="py-2">
              <li>
                <button
                  onClick={() => {
                    insertCellAfter(currentCellId, 'code');
                    setMenuOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <i className="fas fa-code mr-2 text-blue-500"></i>
                  Code Block
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    insertCellAfter(currentCellId, 'text');
                    setMenuOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <i className="fas fa-font mr-2 text-green-500"></i>
                  Text Block
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddCell;
