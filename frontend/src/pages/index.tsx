import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Note {
  id: number;
  title: string;
  content: string;
}

export default function Home() {
  const apiUrl = 'http://localhost:4000';
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });

  // Fetch notes
  useEffect(() => {
    axios.get(`${apiUrl}/notes`).then((response) => {
      setNotes(response.data.reverse());
    }).catch((error) => {
      console.error('Error fetching data:', error);
    });
  }, []);

  // Create note
  const createNote = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios.post(`${apiUrl}/notes`, newNote).then((response) => {
      setNotes([response.data, ...notes]);
      setNewNote({ title: '', content: '' });
    }).catch((error) => {
      console.error('Error creating note:', error);
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

      {/* List of Notes */}
      {notes.map((note) => (
        <div key={note.id}>
          <h3>{note.title}</h3>
          <p>{note.content}</p>
        </div>
      ))}
    </div>
  );
}
