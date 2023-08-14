const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const {
  INVALID_ADD_USER_MESSAGE,
  USER_NOT_FOUND_MESSAGE,
  INVALID_UPDATE_USER_MESSAGE,
  CONFLICT_EMAIL_MESSAGE,
  OK_STATUS,
} = require('../utils/constants');
const { SECRET_STRING } = require('../utils/config');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const ConflictRequestError = require('../errors/ConflictRequestError');

module.exports.getUserInfo = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFound(USER_NOT_FOUND_MESSAGE);
    }
    return res.send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new BadRequest(USER_NOT_FOUND_MESSAGE));
    }
    return next(err);
  }
};
module.exports.postUser = async (req, res, next) => {
  try {
    const {
      email,
      password,
      name,
      about,
      avatar,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    });
    const { _id } = user;
    return res.send({
      email,
      name,
      about,
      avatar,
      _id,
    });
  } catch (err) {
    if (err.code === 11000) {
      return next(new ConflictRequestError(CONFLICT_EMAIL_MESSAGE));
    }
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequest(INVALID_ADD_USER_MESSAGE));
    }
    return next(err);
  }
};
module.exports.patchUser = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true, upsert: false },
    );
    if (!user) {
      throw new NotFound(INVALID_UPDATE_USER_MESSAGE);
    }
    return res.send(user);
  } catch (err) {
    if (err.code === 11000) {
      return next(new ConflictRequestError(CONFLICT_EMAIL_MESSAGE));
    }
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequest(INVALID_UPDATE_USER_MESSAGE));
    }
    return next(err);
  }
};
module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, SECRET_STRING, { expiresIn: '7d' });
    return res.status(OK_STATUS).send({ token });
  } catch (err) {
    return next(err);
  }
};
