// const router = require('express').Router();
const express = require('express');
const { celebrate, Joi } = require('celebrate');
const {
  getCards, postCards, deleteCards, likeCard, dislikeCard,
} = require('../controllers/cards');

const regEx = /(https?:\/\/)(w{3}\.)?([a-zA-Z0-9-]{0,63}\.)([a-zA-Z]{2,4})(\/[\w\-._~:/?#[\]@!$&'()*+,;=]#?)?/;

const cardsRouter = express.Router();
// rout card
cardsRouter.get('/', getCards);
cardsRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(new RegExp(regEx)).required(),

  }),
}), postCards);
cardsRouter.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),

  }),
}), deleteCards);
cardsRouter.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),

  }),
}), likeCard);
cardsRouter.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),

  }),
}), dislikeCard);

module.exports = { cardsRouter };
