const Card = require('../models/card');

// rout card
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => { res.status(500).send({ message: 'Ошибка по умолчанию.' }); });
};

module.exports.postCards = (req, res) => {
  console.log(req);
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.deleteCards = (req, res) => {
  Card.deleteOne({ _id: req.params.cardId })
    .then((deleteStatus) => {
      if (deleteStatus.deletedCount === 0) {
        return res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      return res.send();
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((cards) => {
      if (!cards) {
        return res.status(404).send({ message: ' Передан несуществующий _id карточки.' });
      }
      return res.send(cards);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(400).send({ message: ' Переданы некорректные данные для постановкнилайка.' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((cards) => {
      if (!cards) {
        return res.status(404).send({ message: ' Передан несуществующий _id карточки.' });
      }
      return res.send(cards);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(400).send({ message: ' Переданы некорректные данные для снятии лайка.' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};
