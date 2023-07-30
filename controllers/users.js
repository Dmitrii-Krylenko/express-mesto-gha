const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const BadRequest = require('../errors/badrequesterr');
const Conflict = require('../errors/conflict');
const NotFound = require('../errors/notfound');
const Unauthorized = require('../errors/unauthorized');
// Rout user
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => next(err));
};

module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.userId, {}, { new: true, runValidators: false })
    .then((user) => {
      if (!user) {
        return next(new BadRequest('Пользователь по указанному _id не найден.'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest(
          'Переданы некорректные данные пользователя.',
        );
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => res.status(201).send(user))
      .catch((err) => {
        if (err.code === 11000) {
          return next(new Conflict('Такой пользователь уже существует.'));
        }
        if (err.name === 'CastError' || err.name === 'ValidationError') {
          return next(new BadRequest('Переданы некорректные данные при создании пользователя. по умолчанию.'));
        }
        return next(err);
      }));
};

module.exports.updateUsers = (req, res, next) => {
  const { name, about } = req.body;
  // const owner = req.user._id;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      if (!user) {
        return next(new BadRequest('Пользователь по указанному _id не найден.'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные при обновлении профиля.'));
      }
      return next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  // const owner = req.user._id;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      if (!user) {
        return next(new NotFound('Пользователь по указанному _id не найден.'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные при обновлении профиля.'));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const {
    email, password,
  } = req.body;
  console.log(req.body);
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      // сравниваем переданный пароль и хеш из базы
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            // хеши не совпали — отклоняем промис
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
          const options = {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
          };
          res.cookie('loginedUserToken', token, options);
          // аутентификация успешна
          return res.send({
            token,
          });
        });
    })

    .catch(() => next(new Unauthorized('Необходимо быть авторизованным')));
};

module.exports.getCurrentUser = (req, res, next) => {
  const token = req.cookies.loginedUserToken;
  const decoded = jwt.verify(token, 'some-secret-key');
  const userId = decoded._id;
  console.log(userId);
  console.log(token);
  User.findById(userId, {}, { new: true, runValidators: false })
    .then((user) => res.send(user))
    .catch((err) => next(err));
};
