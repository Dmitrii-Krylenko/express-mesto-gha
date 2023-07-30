const Card = require('../models/card');
const BadRequest = require('../errors/badrequesterr');
const NotFound = require('../errors/notfound');
// const Forbidden = require('../errors/forbidden');
// rout card
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => next(err));
};

module.exports.postCards = (req, res, next) => {
  console.log(req);
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные при создании карточки.'));
      }
      return next(err);
    });
};

module.exports.deleteCards = (req, res, next) => {
  Card.deleteOne({ _id: req.params.cardId, owner: req.user._id })
    .then((deleteStatus) => {
      if (deleteStatus.deletedCount === 0) {
        return next(new NotFound('не владелец карточки'));
      }
      return res.status(200).send({ message: 'УДОЛИЛОСЬ.' });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new NotFound('1Карточка с указанным _id не найдена.'));
      }
      return next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((cards) => {
      if (!cards) {
        return next(new NotFound('Передан несуществующий _id карточки.'));
      }
      return res.status(200).send(cards);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные для постановкни лайка.'));
      }
      return next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((cards) => {
      if (!cards) {
        return next(new NotFound('Передан несуществующий _id карточки.'));
      }
      return res.send(cards);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные для снятии лайка.'));
      }
      return next(err);
    });
};
