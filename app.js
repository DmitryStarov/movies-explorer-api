require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const { routeUsers, routeCards } = require('./routes/index');
const { postUser, login } = require('./controllers/users');
const { INTERNAL_SERVER_STATUS, SERVER_ERROR_MESSAGE } = require('./utils/constants');
const { limiter } = require('./middlewares/limiter');
const { validatePostUser, validateLogin } = require('./middlewares/validation');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFound = require('./errors/NotFound');

const allowedCors = [
  'https://localhost:3000',
  'http://localhost:3000',
];
const corsOptions = {
  origin: allowedCors,
  optionsSuccessStatus: 200,
  credentials: true,
};

const app = express();
const { URL } = process.env;
const { PORT = 3000 } = process.env;
mongoose.connect(URL);
app.use(cors(corsOptions)); app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use('/signin', validateLogin, login);
app.use('/signup', validatePostUser, postUser);
app.use(auth);
app.use('/users', routeUsers);
app.use('/cards', routeCards);
app.use('*', (req, res, next) => {
  next(new NotFound('Страница не найдена'));
});
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = INTERNAL_SERVER_STATUS, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === INTERNAL_SERVER_STATUS
        ? SERVER_ERROR_MESSAGE
        : message,
    });

  next();
});

app.listen(PORT);
