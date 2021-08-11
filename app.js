require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const {
  createUser,
  login,
} = require('./controllers/users');
const defaultRouter = require('./routes/default');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/error-handler');

const {
  PORT = 3000,
  DB_HOST,
  DB_PORT,
  DB_NAME,
} = process.env;

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const app = express();

mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(requestLogger);
app.use('/api/', apiLimiter);
app.use(helmet());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }).unknown(true),
}), createUser);

app.use(auth);
app.use('/users/', usersRouter);
app.use('/movies/', moviesRouter);
app.use('/*', defaultRouter);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
app.listen(PORT);
