const BadRequestError = require('../errors/badRequest');
const ForbiddenError = require('../errors/forbidden');
const InternalServerError = require('../errors/internalServer');
const NotFoundError = require('../errors/notFound');
const Movie = require('../models/movie');

module.exports.getAllMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(() => next(new InternalServerError()));
};

module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;
  Movie.create({ ...req.body, owner })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Data is not valid.'));
      } else {
        next(new InternalServerError());
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .then((movie) => {
      if (movie === null) {
        next(new NotFoundError('Movie not found.'));
      } else if (movie.owner.valueOf() === req.user._id) {
        Movie.findByIdAndRemove(movieId)
          .then(() => {
            res.send(movie);
          })
          .catch(() => {
            next(new InternalServerError());
          });
      } else {
        next(new ForbiddenError("You don't have permissions to delete other movies."));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Id is not a valid.'));
      } else {
        next(new InternalServerError());
      }
    });
};
