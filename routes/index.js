const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const { register, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/notFound');

router.use('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

router.use('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
}), register);

router.use('/users', auth, usersRouter);
router.use('/movies', auth, moviesRouter);

router.use(auth, (req, res, next) => {
  next(new NotFoundError('Запрашиваемый путь не существует.'));
});

module.exports = router;
