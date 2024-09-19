const express = require('express');
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategoryStatus,
  getNotesByCategory,
} = require('../controllers/categoriesController');

const router = express.Router();

// define routes
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.post('/', createCategory);
router.put('/:id', updateCategoryStatus);
router.get('/:id/notes', getNotesByCategory);

module.exports = router;
