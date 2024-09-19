const express = require('express');
const {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  addNoteToCategory,
  removeNoteFromCategory,
} = require('../controllers/notesController');

const router = express.Router();

// define routes
router.get('/', getAllNotes);
router.get('/:id', getNoteById);
router.post('/', createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);
router.put('/:id/category', addNoteToCategory);
router.put('/:id/remove-category', removeNoteFromCategory);

module.exports = router;
