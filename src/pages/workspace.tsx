import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import CreateNotebook from '@/components/notes/create-notebook.tsx';
import NotebookView from '@/components/notes/notebook-view.tsx';
import NotFound from '@/components/not-found.tsx';
import NoteView from '@/components/notes/note-view.tsx';
import { Sidebar } from '@/components/notes/sidebar.tsx';
import { setRecentNotebookId } from '@/utils/recent-notebook.ts';
import { useFocusMode } from '@/context/FocusModeContext.tsx';
import { RedirectToRecentOrCreate } from './redirect-to-recent-or-create.tsx';

export default function WorkSpace() {
  const location = useLocation();
  const { isFocusMode } = useFocusMode();
  const onNotePage = /\/notebook\/[^/]+\/note\/[^/]+/.test(location.pathname);
  const focusActive = isFocusMode && onNotePage;

  useEffect(() => {
    const notebookMatch = location.pathname.match(/\/notebook\/([^/]+)/);
    const id = notebookMatch?.[1];
    // Don't treat playground as recent — it's a try-out route, not a user notebook
    if (id && id !== 'playground') {
      setRecentNotebookId(id);
    }
  }, [location.pathname]);

  return (
    <div
      className="workspace-shell flex h-screen overflow-hidden bg-[var(--bg)]"
      data-focus={focusActive ? 'true' : undefined}
    >
      {/* App Shell: sidebar fixed in viewport, only main scrolls */}
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-auto custom-scrollbar">
        <Routes>
          <Route index element={<RedirectToRecentOrCreate />} />
          <Route path="/create-notebook" element={<CreateNotebook />} />

          <Route
            path="/notebook/:notebookId"
            element={<NotebookView coverImage="/images/notebook-cover.jpg" />}
          />

          <Route
            path="/notebook/:notebookId/note/:noteId"
            element={<NoteView />}
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
