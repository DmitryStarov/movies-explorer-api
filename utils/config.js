require('dotenv').config();

const {
  NODE_ENV,
  PORT,
  DB_URL,
  SECRET_KEY,
} = process.env;
const DEV_PORT = 3000;
const DEV_DB_URL = 'mongodb://127.0.0.1:27017/moviesexplorerdb';
const DEV_SECRET_KEY = 'some-secret-key';
const SERVER_PORT = NODE_ENV === 'production' && PORT ? PORT : DEV_PORT;
const SECRET_STRING = NODE_ENV === 'production' && SECRET_KEY ? SECRET_KEY : DEV_SECRET_KEY;
const DB = NODE_ENV === 'production' && DB_URL ? DB_URL : DEV_DB_URL;

module.exports = {
  DB,
  SERVER_PORT,
  SECRET_STRING,
};
