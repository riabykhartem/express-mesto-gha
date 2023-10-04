const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, createUser, getUserById, updateUser, updateAvatar, login, getCurrentUser,
} = require('../controllers/users');
const authorization = require('../middlewares/auth');
const { URL_REGEX, EMAIL_REGEX } = require('../utils/constants');

router.get('/users', authorization, getUsers);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(EMAIL_REGEX),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(URL_REGEX),
  }),
}), createUser);

router.get('/:userId', authorization, getUserById);

router.patch('/users/me', authorization, updateUser);

router.patch('/users/me/avatar', authorization, updateAvatar);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(EMAIL_REGEX),
    password: Joi.string().required(),
  }),
}), login);

router.get('/users/me', getCurrentUser);

module.exports = router;
