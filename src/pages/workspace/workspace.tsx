import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Sidebar } from '../../components/notes/sidebar.tsx';
import NotebookView from '@/components/notes/notebook-view.tsx';
import NoteView from '@/components/notes/note-view.tsx';
import CreateNote from '@/components/notes/create-note.tsx';
import CreateNotebook from '@/components/notes/create-notebook.tsx';
import NotebookCover from '@/components/notes/notebook-cover.tsx';
import NotFound from '@/components/not-found.tsx';

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

  const [notes, setNotes] = useState([
    { id: '1', title: 'Welcome Note' },
    { id: '2', title: 'Project Ideas' },
  ]);

  const handleEdit = () => {
    alert('Edit Cover or Details triggered!');
  };

  const handleAddNote = (title: string) => {
    const newNote = { id: Date.now().toString(), title };
    setNotes([...notes, newNote]);
  };

  const handleEditNote = (id: string, updatedTitle: string) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, title: updatedTitle } : note
      )
    );
  };

  return (
    <Routes>
      <Route path="/create-notebook" element={<CreateNotebook />} />

      <Route
        path="/notebook/:notebookId"
        element={
          <NotebookCover
            title="My First Notebook"
            description="This is where my notes live. Add thoughts, ideas, and plans here."
            coverImage="/images/notebook-cover.jpg" // Example image path
            notes={notes}
            onEdit={handleEdit}
            onAddNote={handleAddNote}
            onEditNote={handleEditNote}
          />
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
