const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: 'Превышено количество запросов на сервер. Пожалуйста, повторите позже',
});

module.exports = { limiter };
