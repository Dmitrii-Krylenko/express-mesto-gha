// const router = require('express').Router();
const express = require('express');

const usersRouter = express.Router();

const {
  getUsers, getUserId, createUser, updateUsers, updateAvatar,
} = require('../controllers/users');

// Rout user
usersRouter.get('/users', getUsers);

usersRouter.get('/users/:userId', getUserId);

usersRouter.post('/users', createUser);

usersRouter.patch('/users/me', updateUsers);

usersRouter.patch('/users/me/avatar', updateAvatar);

module.exports = { usersRouter };
