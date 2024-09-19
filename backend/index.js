const express = require('express');
const app = express();
const notesRoutes = require('./routes/notesRoutes');
const categoriesRoutes = require('./routes/categoriesRoutes');

// JSON middleware
app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Test API
app.get('/test', (req, res) => {
  try {
    res.status(200).json({ message: 'API is working' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Use routes
app.use('/notes', notesRoutes);
app.use('/categories', categoriesRoutes);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
