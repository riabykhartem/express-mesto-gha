/* eslint-disable no-shadow */
const JWT = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer')) {
      return res.status(401).send({ message: 'not authorized' });
    }
    const token = authorization.split(' ')[1];
    const parsedToken = await JWT.verify(token, 'cheburashka');
    if (parsedToken) {
      req.user = {
        _id: parsedToken._id,
      };
      next();
    }
  } catch (err) {
    if (err instanceof JWT.JsonWebTokenError) {
      return res.status(401).send({ message: 'not authorized' });
    }
    return res.status(500).send({ message: 'Server Error' });
  }
};
module.exports = auth;
