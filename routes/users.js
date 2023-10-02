const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, createUser, getUserById, updateUser, updateAvatar, login, getCurrentUser,
} = require('../controllers/users');
const authorization = require('../middlewares/auth');

router.get('/users', authorization, getUsers);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.link(),
    title: Joi.string().required().min(2).max(30),
    text: Joi.string().required().min(2),
  }),
}), createUser);

router.get('/users/:userId', authorization, getUserById);

router.patch('/users/me', authorization, updateUser);

router.patch('/users/me/avatar', authorization, updateAvatar);

router.post('/signin', login);

router.get('/users/me', authorization, getCurrentUser);

module.exports = router;
