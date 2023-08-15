const jwt = require('jsonwebtoken');
const { SECRET_STRING } = require('../utils/config');
const { AUTH_ERR_MESSAGE } = require('../utils/constants');
const AuthError = require('../errors/AuthError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthError(AUTH_ERR_MESSAGE));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, SECRET_STRING);
  } catch (err) {
    return next(new AuthError(AUTH_ERR_MESSAGE));
  }
  req.user = payload;
  return next();
};
