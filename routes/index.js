const express = require('express');
const { usersRouter } = require('./users');
const { cardsRouter } = require('./cards');

const routes = express.Router();

routes.use('/', usersRouter);
routes.use('/', cardsRouter);

module.exports = { routes };
