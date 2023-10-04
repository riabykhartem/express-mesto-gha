const JWT = require('jsonwebtoken');
const { SECRET_KEY } = require('../utils/constants');

const NotAuthoirizedError = require('../errors/NotAuthoirizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new NotAuthoirizedError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = JWT.verify(token, SECRET_KEY);
  } catch (err) {
    next(new NotAuthoirizedError('Необходима авторизация'));
  }
  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
