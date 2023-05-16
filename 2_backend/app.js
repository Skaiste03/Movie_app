const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const {
  createMovie,
  deleteMovie,
  getLimitedMovies,
  updateMovie,
  getAllMovies,
} = require('./controller/movie/movie.controller.js');

const app = express();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: process.env.DOMAIN || 'http://127.0.0.1:5500',
  })
);

// Connecting to DB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connecting to MongoDB');

    // Starting server
    app.listen(process.env.PORT, () => console.log('Starting server'));
  })
  .catch((e) => console.log(e));

// Routes
// GET - all movies
app.get('/api/movies', getAllMovies);

// GET - movies by page
app.get('/api/movies/:page', getLimitedMovies);

// POST - add new movie
app.post('/api/movies', createMovie);

// PUT - update single movie
app.put('/api/movies/:id', updateMovie);

// DELETE - delete single movie
app.delete('/api/movies/:id', deleteMovie);
