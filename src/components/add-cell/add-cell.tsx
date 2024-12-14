import React from 'react';
import { useActions } from '@/hooks/use-actions.ts';

interface AddCellProps {
  prevCellId: string | null;
  forceVisible?: boolean;
}

const AddCell: React.FC<AddCellProps> = ({ prevCellId, forceVisible }) => {
  const { insertCellAfter } = useActions();

  return (
    <div
      className={`flex items-center my-4 ${
        forceVisible ? '' : 'opacity-50 hover:opacity-100 transition-opacity'
      }`}
    >
      {/* Divider Line */}
      <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600" />

      {/* Add Buttons */}
      <div className="flex items-center justify-center mx-4 space-x-2">
        <button
          className="relative flex items-center px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded shadow hover:bg-blue-600 dark:hover:bg-green-700 transition"
          onClick={() => insertCellAfter(prevCellId, 'code')}
        >
          <span className="mr-2">+</span>
          <i className="fas fa-code mr-2" />
        </button>
        <button
          className="flex items-center px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded shadow hover:bg-blue-600 dark:hover:bg-green-700 transition"
          onClick={() => insertCellAfter(prevCellId, 'text')}
        >
          <span className="mr-2">+</span>
          <i className="fas fa-font mr-2" />
        </button>
      </div>

      {/* Divider Line */}
      <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600" />
    </div>
  );
};

export default AddCell;
