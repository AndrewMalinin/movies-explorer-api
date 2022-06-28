const router = require('express').Router();
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
const movieController = require('../controllers/movies');

router.get('/', movieController.getAllMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    thumbnail: Joi.string().required().custom((value, helpers) => (validator.isURL(value) ? value : helpers.message('Invalid URL'))),
    image: Joi.string().required().custom((value, helpers) => (validator.isURL(value) ? value : helpers.message('Invalid URL'))),
    trailerLink: Joi.string().required().custom((value, helpers) => (validator.isURL(value) ? value : helpers.message('Invalid URL'))),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    movieId: Joi.number().required(),
  }),
}), movieController.createMovie);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.number().required(),
  }),
}), movieController.deleteMovie);

module.exports = router;
