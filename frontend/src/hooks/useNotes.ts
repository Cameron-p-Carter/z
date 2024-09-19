import { useState, useEffect } from 'react';
import axios from 'axios';

interface Note {
  id: number;
  title: string;
  content: string;
  categoryId?: number | null;
}

export const useNotes = (apiUrl: string) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // fetch notes
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get(`${apiUrl}/notes`);
        setNotes(response.data.reverse());
        if (response.data.length > 0) setSelectedNote(response.data[0]);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };

    fetchNotes();
  }, [apiUrl]);

  // create new note
  const createNewNote = async () => {
    try {
      const response = await axios.post(`${apiUrl}/notes`, {
        title: 'Untitled',
        content: '',
      });
      const newNote = response.data;
      setNotes([newNote, ...notes]);
      setSelectedNote(newNote);
      setIsEditing(true);
    } catch (error) {
      console.error('Error creating new note:', error);
    }
  };

  // update existing note
  const handleUpdateNote = async () => {
    if (selectedNote) {
      try {
        await axios.put(`${apiUrl}/notes/${selectedNote.id}`, {
          title: selectedNote.title,
          content: selectedNote.content,
        });
        setNotes(notes.map((note) => (note.id === selectedNote.id ? selectedNote : note)));
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating note:', error);
      }
    }
  };

  // delete note
  const deleteNote = async (noteId: number) => {
    try {
      await axios.delete(`${apiUrl}/notes/${noteId}`);
      setNotes(notes.filter((note) => note.id !== noteId));
      if (selectedNote?.id === noteId) setSelectedNote(null);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return {
    notes,
    selectedNote,
    isEditing,
    setSelectedNote,
    setIsEditing,
    createNewNote,
    handleUpdateNote,
    deleteNote,
  };
};
