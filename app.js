const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
require('dotenv').config();

const mainRouter = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const corsChecker = require('./middlewares/corsChecker');

if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_ENV = 'develop';
  process.env.JWT_SECRET = 'develop-jwt-secret-key';
}
const { PORT = 3000, DB_ADDRESS = 'mongodb://127.0.0.1:27017/moviesdb' } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(corsChecker);
app.use(requestLogger); // подключаем логгер запросов

app.use(helmet({
  hidePoweredBy: true,
  contentSecurityPolicy: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

app.use('/', mainRouter);

app.use(errorLogger); // подключаем логгер запросов
app.use(errors());
app.use(errorHandler);

mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
})
  // eslint-disable-next-line no-console
  .then(() => console.log('Database connected!'))
  // eslint-disable-next-line no-console
  .catch((err) => console.log(`Database connection error: ${err.name} (${err.message})`));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
