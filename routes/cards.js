// const router = require('express').Router();
const express = require('express');
const {
  getCards, postCards, deleteCards, likeCard, dislikeCard,
} = require('../controllers/cards');

const cardsRouter = express.Router();
// rout card
cardsRouter.get('/cards', getCards);
cardsRouter.post('/cards', postCards);
cardsRouter.delete('/cards/:cardId', deleteCards);
cardsRouter.put('/cards/:cardId/likes', likeCard);
cardsRouter.delete('/cards/:cardId/likes', dislikeCard);

module.exports = { cardsRouter };
