const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

//json
app.use(express.json());

//cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

//test api
app.get('/test', (req, res) => {
  try {
    res.status(200).json({ message: 'API is working' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get all notes
app.get('/notes', async (req, res) => {
  try {
    const notes = await prisma.note.findMany();
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


//get note by id
app.get('/notes/:id', async (req, res) => {
  try {
    const note = await prisma.note.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create note
app.post('/notes', async (req, res) => {
  try {
    const note = await prisma.note.create({
      data: {
        title: req.body.title || 'Untitled', // Default title
        content: req.body.content || '', // Default content
      },
    });
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


//update note
app.put('/notes/:id', async (req, res) => {
  try {
    const note = await prisma.note.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        title: req.body.title,
        content: req.body.content
      },
    });
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//delete note
app.delete('/notes/:id', async (req, res) => {
  try {
    const note = await prisma.note.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get all categories
app.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get category by id
app.get('/categories/:id', async (req, res) => {
  try {
    const category = await prisma.category.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new category
app.post('/categories', async (req, res) => {
  try {
    const category = await prisma.category.create({
      data: {
        category_name: req.body.category_name,
        is_deleted: false // Default to false for new categories
      },
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update the is_deleted status of a category
app.put('/categories/:id', async (req, res) => {
  try {
    const category = await prisma.category.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        is_deleted: req.body.is_deleted,
      },
    });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a note to a category
app.put('/notes/:id/category', async (req, res) => {
  try {
    const { categoryId } = req.body;
    const note = await prisma.note.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        categoryId: categoryId ? Number(categoryId) : null, // Allow setting to null to remove category
      },
    });
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove a note from a category
app.put('/notes/:id/remove-category', async (req, res) => {
  try {
    const note = await prisma.note.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        categoryId: null, // Disassociate the note from any category
      },
    });
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Get all notes for a specific category
app.get('/categories/:id/notes', async (req, res) => {
  try {
    const categoryId = Number(req.params.id);
    const notes = await prisma.note.findMany({
      where: {
        categoryId: categoryId,
      },
    });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});






//start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));