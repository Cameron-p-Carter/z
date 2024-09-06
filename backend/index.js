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

//create note
app.post('/notes', async (req, res) => {
  try {
    const note = await prisma.note.create({
      data: {
        title: req.body.title,
        content: req.body.content
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

//start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));