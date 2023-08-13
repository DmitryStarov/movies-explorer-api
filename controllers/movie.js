const mongoose = require('mongoose');
const Movie = require('../models/movie');

const {
  CREATED_STATUS,
  INVALID_ADD_MOVIE_MESSAGE,
  MOVIE_NOT_FOUND_MESSAGE,
  FORBIDDEN_DELETE_MOVIE_MESSAGE,
} = require('../utils/constants');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const Forbidden = require('../errors/Forbidden');

module.exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ owner: req.user._id }).populate('owner');
    return res.send(movies.reverse());
  } catch (err) {
    return next(err);
  }
};
module.exports.postMovie = async (req, res, next) => {
  try {
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
    } = req.body;
    const movie = await Movie
      .create({
        country,
        director,
        duration,
        year,
        description,
        image,
        trailerLink,
        thumbnail,
        movieId,
        nameRU,
        nameEN,
        owner: req.user._id,
      });
    await movie.populate('owner');
    return res.status(CREATED_STATUS).send(movie);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequest(INVALID_ADD_MOVIE_MESSAGE));
    }
    return next(err);
  }
};
module.exports.deleteMovie = async (req, res, next) => {
  try {
    const { _id: movieId } = req.params;
    const movie = await Movie.findById(movieId).populate('owner');
    if (!movie) {
      return next(new NotFound(MOVIE_NOT_FOUND_MESSAGE));
    }
    if (!movie.owner.equals(req.user._id)) {
      return next(new Forbidden(FORBIDDEN_DELETE_MOVIE_MESSAGE));
    }
    await movie.deleteOne(movie);
    return res.send(movie);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new BadRequest(MOVIE_NOT_FOUND_MESSAGE));
    }
    return next(err);
  }
};
