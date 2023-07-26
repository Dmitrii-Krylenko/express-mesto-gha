const express = require('express');
const { usersRouter, userPublicRouter } = require('./users');
const { cardsRouter } = require('./cards');
const { auth } = require('../middlewares/auth');

const routes = express.Router();

routes.use('/', userPublicRouter);

routes.use('/cards', auth, cardsRouter);
routes.use('/users', auth, usersRouter);
routes.use('*', (req, res) => { res.status(404).json({ message: 'Страница не найдена' }); });

module.exports = { routes };
