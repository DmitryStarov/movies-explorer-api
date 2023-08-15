const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { INVALID_EMAIL } = require('../utils/constants');
const AuthError = require('../errors/AuthError');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => validator.isEmail(email),
        message: INVALID_EMAIL,
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
    },
  },
  {
    versionKey: false,
  },
);
userSchema.statics.findUserByCredentials = async function checkUser(email, password) {
  const user = await this.findOne({ email }).select('+password');
  if (!user) throw new AuthError('Неправильные почта или пароль');
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) throw new AuthError('Неправильные почта или пароль');
  return user;
};

module.exports = mongoose.model('user', userSchema);
