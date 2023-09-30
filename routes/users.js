const router = require('express').Router();
const {
  getUsers, createUser, getUserById, updateUser, updateAvatar, login,
} = require('../controllers/users');
const authorization = require('../middlewares/auth');

router.get('/users', authorization, getUsers);

router.post('/signup', createUser);

router.get('/users/:userId', authorization, getUserById);

router.patch('/users/me', authorization, updateUser);

router.patch('/users/me/avatar', authorization, updateAvatar);

router.post('/signin', login);

module.exports = router;
