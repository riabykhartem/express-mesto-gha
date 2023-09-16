/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
const User = require('../models/user');

const getUsers = (req, res) => User.find({})
  .then((users) => res.status(200).send(users));

const createUser = (req, res) => {
  const newUserData = req.body;
  return User.create(newUserData)
    .then((newUser) => res.status(201).send(newUser))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: `${Object.values(err.errors).map((err) => err.message).join(', ')}`,
        });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: 'некоректный id пользователя',
        });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: `${Object.values(err.errors).map((err) => err.message).join(', ')}`,
        });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: `${Object.values(err.errors).map((err) => err.message).join(', ')}`,
        });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

module.exports = {
  getUsers, createUser, getUserById, updateUser, updateAvatar,
};
