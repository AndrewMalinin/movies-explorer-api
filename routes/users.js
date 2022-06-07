const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userController = require('../controllers/users');

router.get('/me', userController.getAutorizedUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
}), userController.updateProfile);

module.exports = router;
