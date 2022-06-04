const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const movieController = require('../controllers/movies');
const URL_REGEXP = require('../utils/regexps');

router.get('/', movieController.getAllMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(30),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    thumbnail: Joi.string().required().pattern(URL_REGEXP),
    image: Joi.string().required().pattern(URL_REGEXP),
    trailerLink: Joi.string().required().pattern(URL_REGEXP),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    movieId: Joi.string().required(),
    link: Joi.string().required().pattern(URL_REGEXP),
  }),
}), movieController.createMovie);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().length(24).hex(),
  }),
}), movieController.deleteMovie);

module.exports = router;
