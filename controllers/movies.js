const Movie = require('../models/movie');

const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    nameEN,
    nameRU,
  } = req.body;
  const { user } = req;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    owner: user._id,
    nameEN,
    nameRU,
  })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      if (err.name && (err.name === 'ValidationError' || err.name === 'CastError')) {
        throw new BadRequestError('Переданы некорректные данные при создании карточки');
      }
      throw err;
    })
    .catch(next);
};

module.exports.getAllMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send({ data: movies }))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найден');
      } else if (movie.owner._id && movie.owner._id.toString() === req.user._id) {
        Movie.findByIdAndRemove(req.params.movieId)
          .then((deletedMovie) => {
            res.send({ data: deletedMovie });
          })
          .catch((err) => {
            throw err;
          });
      } else {
        throw new ForbiddenError('Попытка удалить чужой фильм');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные при удалении фильма');
      }
      throw err;
    })
    .catch(next);
};
