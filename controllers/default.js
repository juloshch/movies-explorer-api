const NotFoundError = require('../errors/not-found-error');

module.exports.notFoundErr = (req, res, next) => {
  next(new NotFoundError('Ресурс не найден'));
};
