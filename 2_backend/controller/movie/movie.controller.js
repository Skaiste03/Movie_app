const Movie = require('../../model/movie.model.js');
const MESSAGES = require('../../shared/constants.js');

// GET - get all movies
const getAllMovies = async (_req, res) => {
  try {
    const movies = await Movie.find();

    res.send(movies);
  } catch (error) {
    console.log(error);
  }
};
// GET - get movies by page and amount
const getLimitedMovies = async (req, res) => {
  try {
    // Get all movies
    const movies = await Movie.find();

    // Set movie amount and page
    const amount = 10;
    let page = +req.params.page;

    // Get slice start/end index
    const startIndex = (page - 1) * amount;
    const endIndex = page * amount;

    // Slice movies array
    const results = movies.slice(startIndex, endIndex);

    res.send(results);
  } catch (error) {
    console.log(error);
  }
};

// POST - add new movie
const createMovie = async (req, res) => {
  try {
    const newMovieData = req.body;

    const validatedMovie = new Movie(newMovieData);
    const newMovie = await validatedMovie.save();

    if (!newMovie) res.status(400).json({ message: MESSAGES.failure('saved') });

    res.json({ message: MESSAGES.success('saved') });
  } catch (error) {
    console.log(error);
  }
};

// PUT - update single movie
const updateMovie = async (req, res) => {
  try {
    const movieId = req.params.id;
    const dataToUpdate = req.body;

    const updatedMovie = await Movie.findByIdAndUpdate(movieId, dataToUpdate);

    if (!updatedMovie)
      res.status(400).json({ message: MESSAGES.failure('updated') });

    res.json({ message: MESSAGES.success('updated') });
  } catch (error) {
    console.log(error);
  }
};

// DELETE - delete single movie
const deleteMovie = async (req, res) => {
  try {
    const movieId = req.params.id;

    const deletedMovie = await Movie.findByIdAndDelete(movieId);

    if (!deletedMovie)
      res.status(400).json({ message: MESSAGES.failure('deleted') });

    res.json({ message: MESSAGES.success('deleted') });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getLimitedMovies,
  createMovie,
  updateMovie,
  deleteMovie,
  getAllMovies,
};
