const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  createMovie,
  getAllMovies,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getAllMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().integer().required(),
    year: Joi.number().integer().required(),
    description: Joi.string().required(),
    // eslint-disable-next-line no-useless-escape
    image: Joi.string().required().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/),
    // eslint-disable-next-line no-useless-escape
    trailer: Joi.string().required().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/),
    // eslint-disable-next-line no-useless-escape
    thumbnail: Joi.string().required().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/),
    owner: Joi.string().hex().length(24),
    nameRU: Joi.string().required().pattern(/[а-яёА-ЯЁ \d]/),
    nameEN: Joi.string().required().pattern(/\w /),
  }).unknown(true),
}),
createMovie);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
}),
deleteMovie);

module.exports = router;
