import React, { useState } from 'react';
import { CellTypes } from '@/state/index.ts';

interface BlockProps {
  content: string;
  type?: CellTypes;
  handler: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

const Block: React.FC<BlockProps> = ({
  content,
  handler,
  type = 'text',
  onFocus,
  onBlur,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handler(e.target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };

  const renderContent = () => {
    switch (type) {
      case 'text':
        return (
          <textarea
            value={content}
            onChange={handleChange}
            placeholder="Type '/' for commands..."
            className={`w-full resize-none bg-transparent border-none focus:ring-0 text-gray-800 dark:text-gray-200 ${
              isFocused ? 'focus:outline-none' : ''
            }`}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-label="Text block"
          />
        );

      case 'code':
        return (
          <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg w-full">
            <textarea
              value={content}
              onChange={handleChange}
              placeholder="Write your code..."
              className="w-full bg-transparent border-none focus:ring-0 text-gray-800 dark:text-gray-200 focus:outline-none"
              onFocus={handleFocus}
              onBlur={handleBlur}
              aria-label="Code block"
            />
          </pre>
        );

      case 'todo':
        return (
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-1"
              aria-label="To-do checkbox"
            />
            <textarea
              value={content}
              onChange={handleChange}
              placeholder="To-do item..."
              className={`w-full resize-none bg-transparent border-none focus:ring-0 text-gray-800 dark:text-gray-200 ${
                isFocused ? 'focus:outline-none' : ''
              }`}
              onFocus={handleFocus}
              onBlur={handleBlur}
              aria-label="To-do block"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`relative w-full bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-800 ${
        isFocused ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
      }`}
    >
      {renderContent()}
    </div>
  );
};

export default Block;
