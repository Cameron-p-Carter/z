const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// get all notes
const getAllNotes = async (req, res) => {
  try {
    const notes = await prisma.note.findMany();
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get note by ID
const getNoteById = async (req, res) => {
  try {
    const note = await prisma.note.findUnique({
      where: { id: Number(req.params.id) },
    });
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// create note
const createNote = async (req, res) => {
  try {
    const note = await prisma.note.create({
      data: {
        title: req.body.title || 'Untitled',
        content: req.body.content || '',
      },
    });
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update note
const updateNote = async (req, res) => {
  try {
    const note = await prisma.note.update({
      where: { id: Number(req.params.id) },
      data: {
        title: req.body.title,
        content: req.body.content,
      },
    });
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete note
const deleteNote = async (req, res) => {
  try {
    const note = await prisma.note.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// add note to a category
const addNoteToCategory = async (req, res) => {
  try {
    const { categoryId } = req.body;
    const note = await prisma.note.update({
      where: { id: Number(req.params.id) },
      data: {
        categoryId: categoryId ? Number(categoryId) : null,
      },
    });
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// remove note from category
const removeNoteFromCategory = async (req, res) => {
  try {
    const note = await prisma.note.update({
      where: { id: Number(req.params.id) },
      data: { categoryId: null },
    });
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export functions
module.exports = {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  addNoteToCategory,
  removeNoteFromCategory,
};
