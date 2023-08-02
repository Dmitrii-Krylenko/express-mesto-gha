const express = require('express');
const { usersRouter, userPublicRouter } = require('./users');
const { cardsRouter } = require('./cards');
const { auth } = require('../middlewares/auth');
const NotFound = require('../errors/notfound');

const routes = express.Router();

routes.use('/', userPublicRouter);

routes.use('/cards', auth, cardsRouter);
routes.use('/users', auth, usersRouter);
routes.use('*', (req, res, next) => next(
  new NotFound('Страница не найдена.'),
));

module.exports = { routes };
