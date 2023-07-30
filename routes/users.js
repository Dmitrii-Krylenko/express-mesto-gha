// const router = require('express').Router();
const express = require('express');
const { celebrate, Joi } = require('celebrate');
// const auth = require('../middlewares/auth');

const usersRouter = express.Router();
const userPublicRouter = express.Router();
const {
  getUsers, getUserId, createUser, updateUsers, updateAvatar, login, getCurrentUser,
} = require('../controllers/users');

const regEx = /(https?:\/\/)(w{3}\.)?([a-zA-Z0-9-]{0,63}\.)([a-zA-Z]{2,4})(\/[\w\-._~:/?#[\]@!$&'()*+,;=]#?)?/;
// Rout user
usersRouter.get('/', getUsers);

usersRouter.get('/me', getCurrentUser);

usersRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().required(),
  }),
}), getUserId);

userPublicRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(new RegExp(regEx)),
    email: Joi.string().email().required(),
    password: Joi.string().required(),

  }),
}), createUser);

userPublicRouter.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),

  }),
}), login);

usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),

  }),
}), updateUsers);

usersRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(new RegExp(regEx)),

  }),
}), updateAvatar);

module.exports.usersRouter = usersRouter;
module.exports.userPublicRouter = userPublicRouter;
