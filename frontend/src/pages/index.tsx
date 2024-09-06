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
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Notes Archive</h1>

        <div className="flex justify-center mb-6">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Add New Note
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {notes.map((note) => (
            <div key={note.id} className="border p-4 rounded-md bg-white shadow">
              <CardComponent card={note} />
              <div className="mt-2 flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setUpdateNote({
                      id: note.id.toString(),
                      title: note.title,
                      content: note.content,
                    });
                    setIsUpdateModalOpen(true);
                  }}
                  className="bg-blue-500 text-white px-4 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="bg-red-500 text-white px-4 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl mb-4">Create New Note</h2>
              <form onSubmit={createNote}>
                <input
                  type="text"
                  placeholder="Title"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  className="w-full mb-2 p-2 border rounded"
                />
                <textarea
                  placeholder="Content"
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  className="w-full mb-2 p-2 border rounded"
                />
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => setIsCreateModalOpen(false)} className="bg-gray-300 px-4 py-2 rounded">
                    Cancel
                  </button>
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isUpdateModalOpen && (
          <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl mb-4">Update Note</h2>
              <form onSubmit={handleUpdateNote}>
                <input
                  type="text"
                  placeholder="Title"
                  value={updateNote.title}
                  onChange={(e) => setUpdateNote({ ...updateNote, title: e.target.value })}
                  className="w-full mb-2 p-2 border rounded"
                />
                <textarea
                  placeholder="Content"
                  value={updateNote.content}
                  onChange={(e) => setUpdateNote({ ...updateNote, content: e.target.value })}
                  className="w-full mb-2 p-2 border rounded"
                />
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => setIsUpdateModalOpen(false)} className="bg-gray-300 px-4 py-2 rounded">
                    Cancel
                  </button>
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
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
