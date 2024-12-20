import React from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  title,
  onConfirm,
  onCancel,
  children,
}) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Modal Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 opacity-95 -z-10"
        aria-hidden="true"
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 shadow-xl rounded-2xl overflow-hidden transform transition-transform duration-300 ease-out">
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-500 dark:from-blue-900 dark:via-purple-800 dark:to-indigo-900">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button
            onClick={onCancel}
            className="text-gray-300 hover:text-red-400 transition"
            aria-label="Close Modal"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Modal Content */}
        <div className="px-6 py-4 text-gray-800 dark:text-gray-300">
          {children}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
