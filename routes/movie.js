const router = require('express').Router();
const {
  getMovies,
  postMovie,
  deleteMovie,
} = require('../controllers/movie');
const { validatePostMovie, validateDeleteMovie } = require('../middlewares/validation');

router.get('/', getMovies);
router.post('/', validatePostMovie, postMovie);
router.delete('/:movieId', validateDeleteMovie, deleteMovie);
module.exports = router;
