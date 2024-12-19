import React, { useEffect, useRef, useState } from 'react';

interface BlockProps {
  content: string;
  variant: 'heading' | 'description' | 'text' | 'todo';
  className?: string;
  handler: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

const Block: React.FC<BlockProps> = ({
  content,
  handler,
  className = '',
  variant,
  onFocus,
  onBlur,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [localContent, setLocalContent] = useState(content);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setLocalContent(e.target.value);

    if (timer.current) clearTimeout(timer.current);
    // Propagate changes to parent after a delay
    timer.current = setTimeout(() => {
      handler(e.target.value);
    }, 300);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (timer.current) clearTimeout(timer.current); // Ensure no pending updates
    handler(localContent); // Final update to parent
    onBlur?.();
  };

  useEffect(() => {
    setLocalContent(content); // Sync with parent when `content` changes
  }, [content]);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current); // Cleanup on unmount
    };
  }, []);

  const renderContent = () => {
    const baseStyles = {
      heading: 'text-2xl sm:text-3xl lg:text-4xl font-bold',
      description: 'text-base sm:text-lg text-gray-600 dark:text-gray-400',
      text: 'text-gray-800 dark:text-gray-200',
      todo: '',
    };

    const baseInputStyles = `w-full bg-transparent border-none focus:ring-0 focus:outline-none ${baseStyles[variant]} ${className}`;

    switch (variant) {
      case 'heading':
        return (
          <input
            type="text"
            value={localContent}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Enter a title..."
            className={baseInputStyles}
            aria-label="Heading block"
          />
        );

      case 'description':
      case 'text':
        return (
          <textarea
            value={localContent}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="What's on your mind?"
            className={`w-full resize-none bg-transparent border-none focus:ring-0 focus:outline-none ${baseStyles[variant]} ${className}`}
            aria-label="Text block"
          />
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
              value={localContent}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="To-do item..."
              className={`w-full resize-none bg-transparent border-none focus:ring-0 focus:outline-none ${baseStyles.text} ${className}`}
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
