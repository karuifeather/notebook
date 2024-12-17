import { Routes, Route } from 'react-router-dom';
import CreateNotebook from '@/components/notes/create-notebook.tsx';
import NotebookCover from '@/components/notes/notebook-cover.tsx';
import NotFound from '@/components/not-found.tsx';

export default function WorkSpace() {
  return (
    <Routes>
      <Route path="/create-notebook" element={<CreateNotebook />} />

      <Route
        path="/notebook/:notebookId"
        element={
          <NotebookCover
            coverImage="/images/notebook-cover.jpg" // todo: support for cover images
          />
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
