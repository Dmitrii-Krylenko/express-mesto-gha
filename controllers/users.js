const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const BadRequest = require('../errors/BadRequest');
// Rout user
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => { res.status(500).send({ message: 'Ошибка по умолчанию.' }); });
};

module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.userId, {}, { new: true, runValidators: false })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.send(user);
    })
    .catch((err) => {
      console.log(err);

      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new BadRequest('!!!!Переданы некорректные данные при создании пользователя. по умолчанию.'));
        // return res.status(400).send({ message: 'Переданы я. по умолчанию.' });
      }
      return next(err);
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!validator.isEmail(email)) {
    res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя. по умолчанию.' });
    return;
  }
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => res.status(201).send(user))
      .catch((err) => {
        if (err.code === 11000) {
          return res.status(409).send({ message: 'Такой пользователь уже существует.' });
        }
        if (err.name === 'CastError' || err.name === 'ValidationError') {
          return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя. по умолчанию.' });
        }
        return res.status(500).send({ message: 'Ошибка по умолчанию.' });
      }));
};

module.exports.updateUsers = (req, res) => {
  const { name, about } = req.body;
  // const owner = req.user._id;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  // const owner = req.user._id;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.login = (req, res) => {
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

    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports.getCurrentUser = (req, res) => {
  const token = req.cookies.loginedUserToken;
  const decoded = jwt.verify(token, 'some-secret-key');
  const userId = decoded._id;
  console.log(userId);
  console.log(token);
  User.findById(userId, {}, { new: true, runValidators: false })
    .then((user) => res.send(user))
    .catch(() => { res.status(500).send({ message: 'Ошибка по умолчанию.' }); });
};
