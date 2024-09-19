// index.tsx

import React, { useState } from 'react';
import axios from 'axios';
import CardComponent from '../components/CardComponent';
import { useNotes } from '../hooks/useNotes';
import { useCategories } from '../hooks/useCategories';

export default function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  // use custom hooks
  const {
    notes,
    selectedNote,
    isEditing,
    setSelectedNote,
    setIsEditing,
    createNewNote,
    handleUpdateNote,
    deleteNote,
  } = useNotes(apiUrl);

  const {
    categories,
    isAddingCategory,
    newCategoryName,
    setNewCategoryName,
    setIsAddingCategory,
    handleAddCategory,
    toggleCategoryDeletedStatus,
  } = useCategories(apiUrl);

  const [isSelectingCategory, setIsSelectingCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // handle category change for notes
  const handleChangeCategory = async (categoryId: number | null) => {
    if (selectedNote) {
      try {
        await axios.put(`${apiUrl}/notes/${selectedNote.id}/category`, {
          categoryId: categoryId,
        });
        setSelectedNote((prevNote) =>
          prevNote ? { ...prevNote, categoryId: categoryId } : null
        );
        setIsSelectingCategory(false);
      } catch (error) {
        console.error('Error changing category:', error);
      }
    }
  };

  // filter notes based on selected category
  const filteredNotes = selectedCategory === null
    ? notes
    : notes.filter((note) => note.categoryId === selectedCategory);

  return (
    <main className="min-h-screen bg-yellow-50 p-10">
      <div className="max-w-7xl mx-auto flex">
        {/* sidebar */}
        <aside className="w-1/3 bg-gray-200 p-4 rounded-lg shadow-lg overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            {/* category dropdown */}
            <select
              value={selectedCategory === null ? 'all' : selectedCategory}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedCategory(value === 'all' ? null : Number(value));
              }}
              className="category-select"
            >
              <option value="all">All Notes</option>
              {categories
                .filter((category) => !category.is_deleted)
                .map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.category_name}
                  </option>
                ))}
            </select>
            <button
              className="btn btn-primary"
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

        {/* note Content */}
        <section className="w-2/3 p-4 ml-6 bg-white rounded-lg shadow-lg note-content">
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
                    className="input-field"
                  />
                  <textarea
                    placeholder="Content"
                    value={selectedNote.content}
                    onChange={(e) =>
                      setSelectedNote((prev) => (prev ? { ...prev, content: e.target.value } : null))
                    }
                    className="input-field"
                  />
                  <div className="flex justify-end space-x-4 mt-4">
                    <button
                      onClick={() => setIsSelectingCategory(true)}
                      className="btn btn-secondary"
                    >
                      Change Category
                    </button>
                    <button
                      onClick={handleUpdateNote}
                      className="btn btn-primary"
                    >
                      Save
                    </button>
                  </div>

                  {/* category Selection */}
                  {isSelectingCategory && (
                    <div className="mt-4 p-4 border border-gray-300 rounded bg-gray-50">
                      <h3 className="text-lg font-serif font-bold mb-2">Select Category</h3>
                      <ul className="space-y-2">
                        <li>
                          <button
                            onClick={() => handleChangeCategory(null)}
                            className="category-list-item"
                          >
                            None
                          </button>
                        </li>
                        {categories
                          .filter((category) => !category.is_deleted)
                          .map((category) => (
                            <li key={category.id} className="flex justify-between items-center">
                              <button
                                onClick={() => handleChangeCategory(category.id)}
                                className="category-list-item"
                              >
                                {category.category_name}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleCategoryDeletedStatus(category.id, category.is_deleted);
                                }}
                                className="ml-2 px-2 py-1 rounded bg-red-500 hover:bg-red-600 text-white"
                              >
                                Delete
                              </button>
                            </li>
                          ))}
                      </ul>

                      {/* button to show the add new category input */}
                      <button
                        onClick={() => setIsAddingCategory(!isAddingCategory)}
                        className="btn btn-primary mt-4"
                      >
                        {isAddingCategory ? 'Cancel' : 'Add New Category'}
                      </button>

                      {/* input and button to add a new category */}
                      {isAddingCategory && (
                        <div className="mt-2">
                          <input
                            type="text"
                            placeholder="New category name"
                            maxLength={15}
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className="input-field"
                          />
                          <button
                            onClick={handleAddCategory}
                            className="btn btn-primary mt-2 w-full"
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
