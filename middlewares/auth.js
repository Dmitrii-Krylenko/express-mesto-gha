const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/unauthorized');

const handleAuthError = (req, res, next) => next(new Unauthorized('Необходима авторизация.'));
// eslint-disable-next-line consistent-return
module.exports.auth = (req, res, next) => {
  const token = req.cookies.loginedUserToken;
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
