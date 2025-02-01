const RECENT_NOTEBOOK_STORAGE_KEY = 'recent-notebook-id';

export function getRecentNotebookId(): string | null {
  try {
    return localStorage.getItem(RECENT_NOTEBOOK_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setRecentNotebookId(notebookId: string): void {
  try {
    localStorage.setItem(RECENT_NOTEBOOK_STORAGE_KEY, notebookId);
  } catch {
    // ignore
  }
}
