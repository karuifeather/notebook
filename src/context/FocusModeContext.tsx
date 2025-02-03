import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

const STORAGE_KEY = 'ui.focusMode';

function readStored(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === 'true';
  } catch {
    return false;
  }
}

function writeStored(value: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, value ? 'true' : 'false');
  } catch {
    // ignore
  }
}

interface FocusModeContextValue {
  isFocusMode: boolean;
  setFocusMode: (value: boolean) => void;
  toggleFocusMode: () => void;
}

const FocusModeContext = createContext<FocusModeContextValue | null>(null);

export function FocusModeProvider({ children }: { children: React.ReactNode }) {
  const [isFocusMode, setFocusModeState] = useState(readStored);

  useEffect(() => {
    writeStored(isFocusMode);
  }, [isFocusMode]);

  const setFocusMode = useCallback((value: boolean) => {
    setFocusModeState(value);
  }, []);

  const toggleFocusMode = useCallback(() => {
    setFocusModeState((prev) => !prev);
  }, []);

  const value: FocusModeContextValue = {
    isFocusMode,
    setFocusMode,
    toggleFocusMode,
  };

  return (
    <FocusModeContext.Provider value={value}>
      {children}
    </FocusModeContext.Provider>
  );
}

export function useFocusMode(): FocusModeContextValue {
  const ctx = useContext(FocusModeContext);
  if (!ctx) {
    throw new Error('useFocusMode must be used within FocusModeProvider');
  }
  return ctx;
}

export function useFocusModeOptional(): FocusModeContextValue | null {
  return useContext(FocusModeContext);
}
