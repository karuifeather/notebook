import React, { useState } from 'react';

const CreateNote: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    // Save note logic
    console.log('New Note:', { title, description });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        Create New Note
      </h1>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full mb-4 p-2 border border-gray-300 dark:border-gray-700 rounded-md"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        rows={5}
        className="w-full mb-4 p-2 border border-gray-300 dark:border-gray-700 rounded-md"
      />
      <button
        onClick={handleSave}
        className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
      >
        Save Note
      </button>
    </div>
  );
};

export default CreateNote;
