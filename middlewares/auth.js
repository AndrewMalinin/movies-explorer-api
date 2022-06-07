const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized');

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(401)
      .send(new UnauthorizedError());
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res
      .status(401)
      .send(new UnauthorizedError());
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
  return 0;
};
