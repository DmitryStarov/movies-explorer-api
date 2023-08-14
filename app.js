const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const { DB, SERVER_PORT } = require('./utils/config');
const router = require('./routes/index');

const { INTERNAL_SERVER_STATUS, SERVER_ERROR_MESSAGE } = require('./utils/constants');
const { limiter } = require('./middlewares/limiter');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const allowedCors = [
  'https://dstarov.nomoreparties.co',
  'http://dstarov.nomoreparties.co',
  'https://localhost:3000',
  'http://localhost:3000',
];
const corsOptions = {
  origin: allowedCors,
  optionsSuccessStatus: 200,
  credentials: true,
};

const app = express();

mongoose.connect(DB);
app.use(helmet());
app.use(cors(corsOptions)); app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(router);
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

app.listen(SERVER_PORT, () => {
  console.log(`PORT ${SERVER_PORT}`);
});
