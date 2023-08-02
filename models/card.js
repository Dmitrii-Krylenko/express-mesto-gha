const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const cardSchema = new mongoose.Schema({
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  link: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    validate: {
      validator: (link) => isURL(link),
      message: 'Не верный урл',
    },
  },
  owner: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: mongoose.Types.ObjectId, // имя — это строка
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    ref: 'user',
  },
  likes: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: [mongoose.Types.ObjectId], // имя — это строка
    default: [],
    ref: 'user',
  },
  createdAt: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: Date, // имя — это строка
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    default: Date.now,
  },

});
module.exports = mongoose.model('card', cardSchema);
