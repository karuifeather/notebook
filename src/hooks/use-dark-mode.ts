import { useState, useEffect } from 'react';

export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Event listener for changes in the color scheme
    const handleChange = (event: MediaQueryListEvent) => {
      setIsDarkMode(event.matches);
    };

    // Attach the listener
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup the listener on unmount
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isDarkMode;
}
