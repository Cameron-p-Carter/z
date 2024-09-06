import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CardComponent from '../components/CardComponent';

interface Note {
  id: number;
  title: string;
  content: string;
}

export default function Home() {
  const apiUrl = 'http://localhost:4000';
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [updateNote, setUpdateNote] = useState({ id: '', title: '', content: '' });

  useEffect(() => {
    axios.get(`${apiUrl}/notes`).then((response) => {
      setNotes(response.data.reverse());
    }).catch((error) => {
      console.error('Error fetching data:', error);
    });
  }, []);

  const createNote = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios.post(`${apiUrl}/notes`, newNote).then((response) => {
      setNotes([response.data, ...notes]);
      setNewNote({ title: '', content: '' });
    }).catch((error) => {
      console.error('Error creating note:', error);
    });
  };

  const handleUpdateNote = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios.put(`${apiUrl}/notes/${updateNote.id}`, {
      title: updateNote.title,
      content: updateNote.content,
    }).then(() => {
      setNotes(
        notes.map((note) => (note.id === parseInt(updateNote.id) ? updateNote : note))
      );
      setUpdateNote({ id: '', title: '', content: '' });
    }).catch((error) => {
      console.error('Error updating note:', error);
    });
  };

  const deleteNote = (noteId: number) => {
    axios.delete(`${apiUrl}/notes/${noteId}`).then(() => {
      setNotes(notes.filter((note) => note.id !== noteId));
    }).catch((error) => {
      console.error('Error deleting note:', error);
    });
  };

  return (
    <div>
      <h1>Notes</h1>

      {/* Create Note */}
      <form onSubmit={createNote}>
        <input
          type="text"
          placeholder="Title"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Content"
          value={newNote.content}
          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
        />
        <button type="submit">Create Note</button>
      </form>

      {/* Update Note */}
      <form onSubmit={handleUpdateNote}>
        <input
          type="text"
          placeholder="Note ID"
          value={updateNote.id}
          onChange={(e) => setUpdateNote({ ...updateNote, id: e.target.value })}
        />
        <input
          type="text"
          placeholder="New Title"
          value={updateNote.title}
          onChange={(e) => setUpdateNote({ ...updateNote, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="New Content"
          value={updateNote.content}
          onChange={(e) => setUpdateNote({ ...updateNote, content: e.target.value })}
        />
        <button type="submit">Update Note</button>
      </form>

      {/* List of Notes */}
      {notes.map((note) => (
        <div key={note.id}>
          <CardComponent card={note} />
          <button onClick={() => deleteNote(note.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
