const jwt = require('jsonwebtoken');

const handleAuthError = (res) => {
  res
    .status(401)
    .send({ message: 'Необходима авторизация' });
};
// eslint-disable-next-line consistent-return
module.exports.auth = (req, res, next) => {
  const token = req.cookies.loginedUserToken;
  // const decoded = jwt.verify(token, 'some-secret-key');
  // const userId = decoded._id;

  // if (!authorization || !authorization.startsWith('Bearer ')) {
  //   return res
  //     .status(401)
  //     .send({ message: 'Необходима авторизация' });
  // }

  // const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return handleAuthError(res);
    // return res
    //   .status(401)
    //   .send({ message: 'Необходима авторизация' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
