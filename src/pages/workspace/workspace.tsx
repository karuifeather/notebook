import { Routes, Route } from 'react-router-dom';
import CreateNotebook from '@/components/notes/create-notebook.tsx';
import NotebookView from '@/components/notes/notebook-view.tsx';
import NotFound from '@/components/not-found.tsx';
import NoteView from '@/components/notes/note-view.tsx';
import { Sidebar } from '@/components/notes/sidebar.tsx';

export default function WorkSpace() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <Routes>
          <Route path="/create-notebook" element={<CreateNotebook />} />

          <Route
            path="/notebook/:notebookId"
            element={
              <NotebookView
                coverImage="/images/notebook-cover.jpg" // todo: support for cover images
              />
            }
          />

          <Route
            path="/notebook/:notebookId/note/:noteId"
            element={<NoteView />}
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}
