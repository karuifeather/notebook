import React, { useState } from 'react';
import { CellTypes } from '@/state/index.ts';

interface BlockProps {
  content: string;
  type?: CellTypes;
  className?: string;
  handler: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

const Block: React.FC<BlockProps> = ({
  content,
  handler,
  className,
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

  const getPlaceholder = () => {
    switch (type) {
      case 'text':
        return "Type '/' for commands...";
      case 'code':
        return 'Write your code...';
      case 'todo':
        return 'To-do item...';
      default:
        return '';
    }
  };

  const renderContent = () => {
    const baseTextAreaStyles = `w-full resize-none bg-transparent border-none focus:ring-0 text-gray-800 dark:text-gray-200 focus:outline-none ${className}`;

    switch (type) {
      case 'text':
        return (
          <textarea
            value={content}
            onChange={handleChange}
            placeholder={getPlaceholder()}
            className={baseTextAreaStyles}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-label="Text block"
          />
        );

      case 'code':
        return (
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <textarea
              value={content}
              onChange={handleChange}
              placeholder={getPlaceholder()}
              className={baseTextAreaStyles}
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
              className="mt-1 cursor-pointer"
              aria-label="To-do checkbox"
            />
            <textarea
              value={content}
              onChange={handleChange}
              placeholder={getPlaceholder()}
              className={baseTextAreaStyles}
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
      className={`relative w-full p-4 bg-white dark:bg-[#1b1b1b] rounded-lg shadow-md border border-gray-200 dark:border-gray-800 transition-all duration-200 ${
        isFocused ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
      }`}
    >
      {renderContent()}
    </div>
  );
};

export default Block;
