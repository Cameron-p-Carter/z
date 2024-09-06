import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CardComponent from '../components/CardComponent';

interface Note {
  id: number;
  title: string;
  content: string;
}

export default function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [updateNote, setUpdateNote] = useState({ id: '', title: '', content: '' });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  useEffect(() => {
    axios.get(`${apiUrl}/notes`).then((response) => {
      setNotes(response.data.reverse());
    }).catch((error) => {
      console.error('Error fetching data:', error);
    });
  }, []);

  const createNote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/notes`, newNote);
      setNotes([response.data, ...notes]);
      setNewNote({ title: '', content: '' });
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleUpdateNote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.put(`${apiUrl}/notes/${updateNote.id}`, {
        title: updateNote.title,
        content: updateNote.content,
      });
      setUpdateNote({ id: '', title: '', content: '' });
      setIsUpdateModalOpen(false);
      setNotes(
        notes.map((note) => {
          if (note.id === parseInt(updateNote.id)) {
            return { ...note, title: updateNote.title, content: updateNote.content };
          }
          return note;
        })
      );
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const deleteNote = async (noteId: number) => {
    try {
      await axios.delete(`${apiUrl}/notes/${noteId}`);
      setNotes(notes.filter((note) => note.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <main className="min-h-screen bg-yellow-50 p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-center mb-10 text-gray-900">Notes Archive</h1>

        <div className="flex justify-center mb-6">
          <button
            className="px-6 py-2 bg-gray-700 text-white font-semibold rounded-md hover:bg-gray-800 transition duration-200"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Add New Note
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div key={note.id} className="relative">
              <CardComponent card={note} />
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => {
                    setUpdateNote({
                      id: note.id.toString(),
                      title: note.title,
                      content: note.content,
                    });
                    setIsUpdateModalOpen(true);
                  }}
                  className="bg-gray-400 text-white p-2 rounded-full hover:bg-gray-500 transition-all"
                >
                  ✎ {/* Old-style pen icon for edit */}
                </button>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all"
                >
                  ✖ {/* Old-style cross icon for delete */}
                </button>
              </div>
            </div>
          ))}
        </div>

        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-8 shadow-lg max-w-lg w-full">
              <h2 className="text-xl font-serif font-bold mb-4">Create New Note</h2>
              <form onSubmit={createNote} className="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  className="w-full p-2 border border-gray-400 rounded-md bg-yellow-50"
                />
                <textarea
                  placeholder="Content"
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  className="w-full p-2 border border-gray-400 rounded-md bg-yellow-50"
                />
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isUpdateModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-8 shadow-lg max-w-lg w-full">
              <h2 className="text-xl font-serif font-bold mb-4">Update Note</h2>
              <form onSubmit={handleUpdateNote} className="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={updateNote.title}
                  onChange={(e) => setUpdateNote({ ...updateNote, title: e.target.value })}
                  className="w-full p-2 border border-gray-400 rounded-md bg-yellow-50"
                />
                <textarea
                  placeholder="Content"
                  value={updateNote.content}
                  onChange={(e) => setUpdateNote({ ...updateNote, content: e.target.value })}
                  className="w-full p-2 border border-gray-400 rounded-md bg-yellow-50"
                />
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsUpdateModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800">
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
