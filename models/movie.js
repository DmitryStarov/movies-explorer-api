const mongoose = require('mongoose');
const { REG_URL, INVALID_URL } = require('../utils/constants');

const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types;
const movieSchema = new Schema(
  {
    // страна создания фильма
    country: {
      type: String,
      required: true,
    },
    // режиссёр фильма
    director: {
      type: String,
      required: true,
    },
    // длительность фильма
    duration: {
      type: Number,
      required: true,
    },
    // год выпуска фильма
    year: {
      type: Number,
      required: true,
    },
    // описание фильма
    description: {
      type: String,
      required: true,
    },
    // ссылка на постер к фильму
    image: {
      type: String,
      required: true,
      validate: {
        validator(url) {
          return REG_URL.test(url);
        },
        message: INVALID_URL,
      },
    },
    // ссылка на трейлер фильма
    trailerLink: {
      type: String,
      required: true,
      validate: {
        validator(url) {
          return REG_URL.test(url);
        },
        message: INVALID_URL,
      },
    },
    // миниатюрное изображение постера к фильму.
    thumbnail: {
      type: String,
      required: true,
      validate: {
        validator(url) {
          return REG_URL.test(url);
        },
        message: INVALID_URL,
      },
    },
    // _id пользователя, который сохранил фильм.
    owner: {
      type: ObjectId,
      ref: 'user',
      required: true,
    },
    // id фильма, который содержится в ответе сервиса MoviesExplorer
    movieId: {
      type: Number,
      required: true,
    },
    // название фильма на русском языке.
    nameRU: {
      type: String,
      required: true,
    },
    // название фильма на английском языке.
    nameEN: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  },
);
module.exports = mongoose.model('movie', movieSchema);
