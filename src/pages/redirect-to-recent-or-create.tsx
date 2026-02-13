import { useStore } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectNotebooks } from '@/state/selectors/index.ts';
import type { RootState } from '@/state/store.ts';
import { getRecentNotebookId } from '@/utils/recent-notebook.ts';
import Loader from '@/components/loader.tsx';

const PERSIST_KEY = 'persist:root';

function getPersistedNotebooks(): Record<string, unknown> {
  try {
    const raw = localStorage.getItem(PERSIST_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as { notebooks?: string };
    if (!parsed?.notebooks) return {};
    const notebooksSlice = JSON.parse(parsed.notebooks) as {
      data?: Record<string, unknown>;
    };
    return notebooksSlice?.data ?? {};
  } catch {
    return {};
  }
}

const PLAYGROUND_NOTEBOOK_ID = 'playground';

/** True if the user has created their own notebook (not just tried the playground). */
export function isReturningUser(): boolean {
  const recentId = getRecentNotebookId();
  if (recentId && recentId !== PLAYGROUND_NOTEBOOK_ID) return true;
  const persisted = getPersistedNotebooks();
  const ownNotebooks = Object.keys(persisted).filter(
    (id) => id !== PLAYGROUND_NOTEBOOK_ID
  );
  return ownNotebooks.length > 0;
}

/**
 * Redirects to the user's recently used notebook if it exists,
 * otherwise to the create-notebook page.
 */
export function RedirectToRecentOrCreate() {
  const store = useStore<RootState>();
  const notebooks = selectNotebooks(store.getState());
  const recentId = getRecentNotebookId();
  const persisted = getPersistedNotebooks();
  const rawIds =
    Object.keys(notebooks ?? {}).length > 0
      ? Object.keys(notebooks!)
      : Object.keys(persisted);
  const notebookIds = rawIds.filter((id) => id !== PLAYGROUND_NOTEBOOK_ID);

  let to: string;
  if (
    recentId &&
    recentId !== PLAYGROUND_NOTEBOOK_ID &&
    (notebooks?.[recentId] || persisted[recentId])
  ) {
    to = `/app/notebook/${recentId}`;
  } else if (notebookIds.length > 0) {
    to = `/app/notebook/${notebookIds[0]}`;
  } else {
    to = '/app/create-notebook';
  }

  return (
    <>
      <Loader />
      <Navigate to={to} replace />
    </>
  );
}
