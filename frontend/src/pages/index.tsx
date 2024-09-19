import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CardComponent from '../components/CardComponent';

interface Note {
  id: number;
  title: string;
  content: string;
  categoryId?: number; // Add categoryId to the Note interface
}

interface Category {
  id: number;
  category_name: string;
  is_deleted: boolean; // Include the is_deleted property
}

export default function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); // State to store categories
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSelectingCategory, setIsSelectingCategory] = useState(false); // Track if category selection is open
  const [isAddingCategory, setIsAddingCategory] = useState(false); // Track if adding a new category
  const [newCategoryName, setNewCategoryName] = useState(''); // State to hold the new category name
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null); // State for selected category in dropdown

  // Fetch notes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const notesResponse = await axios.get(`${apiUrl}/notes`);
        setNotes(notesResponse.data.reverse());
        if (notesResponse.data.length > 0) setSelectedNote(notesResponse.data[0]);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };

    fetchData();
  }, [apiUrl]); // Add 'apiUrl' to dependency array

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesResponse = await axios.get(`${apiUrl}/categories`);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [apiUrl]); // Add 'apiUrl' to dependency array

  // Create a new note and save it to the database
  const createNewNote = async () => {
    try {
      // Send request to backend to create a new note
      const response = await axios.post(`${apiUrl}/notes`, {
        title: 'Untitled', // Default title
        content: '', // Default content
      });

      const newNote = response.data; // Note from the response

      // Add the new note to the state
      setNotes([newNote, ...notes]);
      setSelectedNote(newNote); // Set the newly created note as the selected note
      setIsEditing(true);
    } catch (error) {
      console.error('Error creating new note:', error);
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
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating note:', error);
      }
    }
  };

  // Handle saving or updating depending on whether it's a new note or existing note
  const handleSaveNote = () => {
    handleUpdateNote(); // Update existing note
  };

  // Update the category of a note in the backend
  const handleChangeCategory = async (categoryId: number | null) => {
    if (selectedNote) {
      try {
        const response = await axios.put(`${apiUrl}/notes/${selectedNote.id}/category`, {
          categoryId: categoryId, // Send null to remove category
        });
        const updatedNote = response.data;
        setNotes(notes.map((note) => (note.id === updatedNote.id ? updatedNote : note)));
        setSelectedNote(updatedNote); // Update the selected note with the new category
        setIsSelectingCategory(false); // Close category selection
      } catch (error) {
        console.error('Error changing category:', error);
      }
    }
  };

  // Function to toggle the is_deleted status of a category
  const toggleCategoryDeletedStatus = async (categoryId: number, currentStatus: boolean) => {
    try {
      // Toggle the status: if currently true, set to false, and vice versa
      const newStatus = !currentStatus;

      // Send request to backend to update is_deleted status
      await axios.put(`${apiUrl}/categories/${categoryId}`, {
        is_deleted: newStatus,
      });

      // Update local state to reflect the change
      setCategories(categories.map((category) =>
        category.id === categoryId ? { ...category, is_deleted: newStatus } : category
      ));
    } catch (error) {
      console.error('Error toggling category status:', error);
    }
  };

  // Function to add a new category
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return; // Do nothing if the name is empty

    try {
      // Send request to backend to create a new category
      const response = await axios.post(`${apiUrl}/categories`, {
        category_name: newCategoryName,
      });

      // Add the new category to the local state
      const createdCategory = response.data;
      setCategories([...categories, createdCategory]);
      setNewCategoryName(''); // Clear the input
      setIsAddingCategory(false); // Close the add category input
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  // Delete note
  const deleteNote = async (noteId: number) => {
    try {
      await axios.delete(`${apiUrl}/notes/${noteId}`);
      setNotes(notes.filter((note) => note.id !== noteId));
      if (selectedNote?.id === noteId) setSelectedNote(null);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  // Filter notes based on selected category
  const filteredNotes = selectedCategory === null
    ? notes // All notes
    : notes.filter((note) => note.categoryId === selectedCategory); // Notes in the selected category

  return (
    <main className="min-h-screen bg-yellow-50 p-10">
      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <aside className="w-1/3 bg-gray-200 p-4 rounded-lg shadow-lg overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            {/* Category Dropdown */}
            <select
              value={selectedCategory === null ? 'all' : selectedCategory}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedCategory(value === 'all' ? null : Number(value));
              }}
              className="px-4 py-2 bg-gray-700 text-white font-semibold rounded-md"
            >
              <option value="all">All Notes</option>
              {categories
                .filter((category) => !category.is_deleted) // Exclude deleted categories
                .map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.category_name}
                  </option>
                ))}
            </select>
            <button
              className="px-4 py-2 bg-gray-700 text-white font-semibold rounded-md hover:bg-gray-800 transition duration-200"
              onClick={createNewNote}
            >
              Add Note
            </button>
          </div>
          <div className="space-y-4">
            {filteredNotes.map((note) => (
              <CardComponent
                key={note.id}
                card={note}
                onClick={() => {
                  setSelectedNote(note);
                  setIsEditing(false);
                }}
                onDelete={() => deleteNote(note.id)}
                onUpdate={() => {
                  setIsEditing(true);
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
                      onClick={() => setIsSelectingCategory(true)} // Open category selection
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      Change Category
                    </button>
                    <button
                      onClick={handleSaveNote} // Save new or update existing note
                      className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
                    >
                      Save
                    </button>
                  </div>

                  {/* Category Selection */}
                  {isSelectingCategory && (
                    <div className="mt-4 p-4 border border-gray-300 rounded bg-gray-50">
                      <h3 className="text-lg font-serif font-bold mb-2">Select Category</h3>
                      <ul className="space-y-2">
                        <li>
                          <button
                            onClick={() => handleChangeCategory(null)} // Remove category
                            className="text-left w-full px-2 py-1 hover:bg-gray-200 rounded"
                          >
                            None
                          </button>
                        </li>
                        {categories
                          .filter((category) => !category.is_deleted) // Filter out categories with is_deleted = true
                          .map((category) => (
                            <li key={category.id} className="flex justify-between items-center">
                              <button
                                onClick={() => handleChangeCategory(category.id)}
                                className="text-left w-full px-2 py-1 hover:bg-gray-200 rounded"
                              >
                                {category.category_name}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent triggering the category selection
                                  toggleCategoryDeletedStatus(category.id, category.is_deleted);
                                }}
                                className={`ml-2 px-2 py-1 rounded bg-red-500 hover:bg-red-600 text-white`}
                              >
                                Delete
                              </button>
                            </li>
                          ))}
                      </ul>

                      {/* Button to show the add new category input */}
                      <button
                        onClick={() => setIsAddingCategory(!isAddingCategory)} // Toggle the new category input
                        className="mt-4 px-4 py-2 bg-gray-700 text-white font-semibold rounded-md hover:bg-gray-800 transition duration-200" // Updated style to match "Add Note" button
                      >
                        {isAddingCategory ? 'Cancel' : 'Add New Category'}
                      </button>

                      {/* Input and button to add a new category */}
                      {isAddingCategory && (
                        <div className="mt-2">
                          <input
                            type="text"
                            placeholder="New category name"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className="w-full p-2 border border-gray-400 rounded-md bg-yellow-50" // Updated style to match "Title" and "Content" inputs
                          />
                          <button
                            onClick={handleAddCategory} // Add the new category
                            className="mt-2 w-full px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800" // Updated style to match "Save" button
                          >
                            Save Category
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-serif font-bold mb-4">{selectedNote.title}</h2>
                  <p className="text-lg font-serif leading-relaxed">{selectedNote.content}</p>
                  {selectedNote.categoryId && (
                    <p className="mt-4 text-sm text-gray-600">
                      Category: {categories.find((cat) => cat.id === selectedNote.categoryId)?.category_name || 'None'}
                    </p>
                  )}
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
