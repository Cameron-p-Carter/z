const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get category by ID
const getCategoryById = async (req, res) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: Number(req.params.id) },
    });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// create category
const createCategory = async (req, res) => {
  try {
    const category = await prisma.category.create({
      data: {
        category_name: req.body.category_name,
        is_deleted: false,
      },
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update category is_deleted status
const updateCategoryStatus = async (req, res) => {
  try {
    const category = await prisma.category.update({
      where: { id: Number(req.params.id) },
      data: { is_deleted: req.body.is_deleted },
    });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get all notes for a specific category
const getNotesByCategory = async (req, res) => {
  try {
    const categoryId = Number(req.params.id);
    const notes = await prisma.note.findMany({
      where: { categoryId: categoryId },
    });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export functions
module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategoryStatus,
  getNotesByCategory,
};
