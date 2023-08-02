const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/unauthorized');

// eslint-disable-next-line consistent-return
module.exports.auth = (req, res, next) => {
  const token = req.cookies.loginedUserToken;
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return next(new Unauthorized('Необходима авторизация.'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
