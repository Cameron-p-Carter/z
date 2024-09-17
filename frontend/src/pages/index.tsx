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
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false); // Track if a new note is being created or edited
  const [isNewNote, setIsNewNote] = useState(false); // Track if it's a newly created note

  // Fetch notes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/notes`);
        setNotes(response.data.reverse());
        if (response.data.length > 0) setSelectedNote(response.data[0]); // Select the first note by default
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Create a new empty note and select it for editing
  const createNewNote = () => {
    const newNote: Note = { id: Date.now(), title: 'Untitled', content: '' }; // Temporary ID
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    setIsEditing(true); // Enable editing mode for new note
    setIsNewNote(true); // This is a new note
  };

  // Save the new note to the backend
  const saveNewNote = async () => {
    if (selectedNote) {
      try {
        const response = await axios.post(`${apiUrl}/notes`, {
          title: selectedNote.title,
          content: selectedNote.content,
        });

        // Replace the temporary note with the saved note (with the actual ID from the backend)
        const savedNote = response.data;
        setNotes([savedNote, ...notes.filter((note) => note.id !== selectedNote.id)]);
        setSelectedNote(savedNote); // Set the selected note to the one with the real ID
        setIsNewNote(false); // Note is now saved
        setIsEditing(false); // Exit edit mode
      } catch (error) {
        console.error('Error saving new note:', error);
      }
    }
  };

  // Update an existing note in the backend
  const handleUpdateNote = async () => {
    if (selectedNote) {
      try {
        await axios.put(`${apiUrl}/notes/${selectedNote.id}`, {
          title: selectedNote.title,
          content: selectedNote.content,
        });
        setNotes(notes.map((note) => (note.id === selectedNote.id ? selectedNote : note)));
        setIsEditing(false); // Exit edit mode
      } catch (error) {
        console.error('Error updating note:', error);
      }
    }
  };

  // Handle saving or updating depending on whether it's a new note or existing note
  const handleSaveNote = () => {
    if (isNewNote) {
      saveNewNote(); // Save new note
    } else {
      handleUpdateNote(); // Update existing note
    }
  };

  // Delete note
  const deleteNote = async (noteId: number) => {
    try {
      await axios.delete(`${apiUrl}/notes/${noteId}`);
      setNotes(notes.filter((note) => note.id !== noteId));
      if (selectedNote?.id === noteId) setSelectedNote(null); // Clear the selected note if it's deleted
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <main className="min-h-screen bg-yellow-50 p-10">
      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <aside className="w-1/3 bg-gray-200 p-4 rounded-lg shadow-lg overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-serif font-bold text-gray-900">All Notes</h2>
            <button
              className="px-4 py-2 bg-gray-700 text-white font-semibold rounded-md hover:bg-gray-800 transition duration-200"
              onClick={createNewNote}
            >
              Add Note
            </button>
          </div>
          <div className="space-y-4">
            {notes.map((note) => (
              <CardComponent
                key={note.id}
                card={note}
                onClick={() => {
                  setSelectedNote(note);
                  setIsEditing(false); // Disable editing when selecting an existing note
                  setIsNewNote(false); // This is not a new note
                }}
                onDelete={() => deleteNote(note.id)}
                onUpdate={() => {
                  setIsEditing(true); // Enable editing mode when updating
                  setIsNewNote(false); // This is not a new note
                }}
                selected={selectedNote?.id === note.id}
              />
            ))}
          </div>
        </aside>

        {/* Note Content */}
        <section className="w-2/3 p-4 ml-6 bg-white rounded-lg shadow-lg note-content" style={{ overflowWrap: 'break-word', whiteSpace: 'normal' }}>
          {selectedNote ? (
            <>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    placeholder="Title"
                    value={selectedNote.title}
                    onChange={(e) =>
                      setSelectedNote((prev) => (prev ? { ...prev, title: e.target.value } : null))
                    }
                    className="w-full p-2 border border-gray-400 rounded-md bg-yellow-50"
                  />
                  <textarea
                    placeholder="Content"
                    value={selectedNote.content}
                    onChange={(e) =>
                      setSelectedNote((prev) => (prev ? { ...prev, content: e.target.value } : null))
                    }
                    className="w-full p-2 border border-gray-400 rounded-md bg-yellow-50"
                  />
                  <div className="flex justify-end space-x-4 mt-4">
                    <button
                      onClick={handleSaveNote} // Save new or update existing note
                      className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
                    >
                      Save
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-serif font-bold mb-4">{selectedNote.title}</h2>
                  <p className="text-lg font-serif leading-relaxed">{selectedNote.content}</p>
                </>
              )}
            </>
          ) : (
            <p className="text-gray-600 italic">No note selected.</p>
          )}
        </section>
      </div>
    </main>
  );
}
