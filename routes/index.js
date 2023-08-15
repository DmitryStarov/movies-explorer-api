const router = require('express').Router();

const routeMovie = require('./movie');
const routeUsers = require('./users');

const { postUser, login } = require('../controllers/users');
const { validatePostUser, validateLogin } = require('../middlewares/validation');
const auth = require('../middlewares/auth');
const NotFound = require('../errors/NotFound');

router.post('/signin', validateLogin, login);
router.post('/signup', validatePostUser, postUser);
router.use(auth);
router.use('/users', routeUsers);
router.use('/movies', routeMovie);
router.use('*', (req, res, next) => {
  next(new NotFound('Страница не найдена'));
});
module.exports = router;
