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

module.exports.getMovies = (req, res, next) => {
  Movie
    .find({})
    .populate(['owner', 'likes'])
    .then((movies) => res.send(movies.reverse()))
    .catch(next);
};
module.exports.postMovie = (req, res, next) => {
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
  Movie
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
    })
    .then((movie) => {
      movie
        .populate('owner')
        .then(() => res.status(CREATED_STATUS).send(movie))
        .catch(next);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequest(INVALID_ADD_MOVIE_MESSAGE));
      }
      return next(err);
    });
};
module.exports.deleteMovie = (req, res, next) => {
  const { _id: movieId } = req.params;
  Movie
    .findById(movieId)
    .populate('owner')
    .then((movie) => {
      if (!movie) {
        return next(new NotFound(MOVIE_NOT_FOUND_MESSAGE));
      }
      if (!movie.owner.equals(req.user._id)) {
        return next(new Forbidden(FORBIDDEN_DELETE_MOVIE_MESSAGE));
      }
      return Movie.deleteOne(movie)
        .then(() => {
          res.send(movie);
        })
        .catch(next);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequest(MOVIE_NOT_FOUND_MESSAGE));
      }
      return next(err);
    });
};
