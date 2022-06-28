const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const UnauthorizedError = require('../errors/unauthorized');
const InternalServerError = require('../errors/internalServer');
const NotFoundError = require('../errors/notFound');
const BadRequestError = require('../errors/badRequest');
const ConflictError = require('../errors/conflict');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' }),
      })
        .end();
    })
    .catch((e) => next(new UnauthorizedError(e.message)));
};

module.exports.register = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    })
      .catch((err) => {
        if (err.code === 11000) {
          next(new ConflictError('Error! This user already exists.'));
        } else {
          next(new InternalServerError(`An error occurred when creating the user. DBMS Error code: ${err.code}.`));
        }
      }))
    .then((user) => {
      res.status(201).send({
        _id: user._id,
        email: user.email,
      });
    })
    .catch(() => {
      next(new BadRequestError('Data is not valid.'));
    });
};

module.exports.getAutorizedUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('User not found.'));
      } else {
        res.send(user);
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

module.exports.updateProfile = (req, res, next) => {
  const userId = req.user._id;
  const { name, email } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user && user._id.toString() !== userId) {
        next(new ConflictError('This email address is already in use.'));
      } else {
        User.findByIdAndUpdate(
          userId,
          { name, email },
          {
            new: true, // обработчик then получит на вход обновлённую запись
            runValidators: true, // данные будут валидированы перед изменением
          },
        )
          .then((foundUser) => {
            if (!foundUser) {
              next(new NotFoundError('User not found.'));
            } else {
              res.send(foundUser);
            }
          })
          .catch((err) => {
            if (err.name === 'ValidationError') {
              next(new BadRequestError('Data is not valid.'));
            } else {
              next(new InternalServerError());
            }
          });
      }
    })
    .catch(() => {
      next(new InternalServerError());
    });
};
