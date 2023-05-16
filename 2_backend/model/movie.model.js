const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  rentPrice: {
    type: Number,
    required: true,
  },
});

const Movie = mongoose.model('movie', movieSchema);
module.exports = Movie;
