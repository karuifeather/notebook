import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Sidebar } from '../../components/notes/sidebar.tsx';
import NotebookView from '@/components/notes/notebook-view.tsx';
import NoteView from '@/components/notes/note-view.tsx';
import CreateNote from '@/components/notes/create-note.tsx';
import CreateNotebook from '@/components/notes/create-notebook.tsx';

export default function WorkSpace() {
  const notebooks = [
    {
      id: 'starter-notebook',
      title: 'Starter Notebook',
      notes: [
        {
          id: 'welcome',
          title: 'Welcome',
          description: 'Welcome to the starter notebook!',
          order: [],
          dependencies: [],
        },
      ],
      dependencies: ['react', 'react-dom'],
    },
  ];

  const handleCreateNotebook = (title: string, description: string) => {
    console.log('New Notebook:', { title, description });
    // Redirect or handle state update here
  };

  const main = (
    <div className="flex-1 p-6">
      <Routes>
        {/* Route for viewing a notebook */}
        <Route path="/notebook/:notebookId" element={<NotebookView />} />

        {/* Route for viewing a specific note in a notebook */}
        <Route
          path="/notebook/:notebookId/notes/:noteId"
          element={<NoteView />}
        />

        {/* Route for creating a new note */}
        <Route
          path="/notebook/:notebookId/create-note"
          element={<CreateNote />}
        />

        <Route path="*" element={<h1>404 - Not Found</h1>} />
      </Routes>
    </div>
  );

  return (
    <Routes>
      <Route path="/create-notebook" element={<CreateNotebook />} />
    </Routes>
  );
}
