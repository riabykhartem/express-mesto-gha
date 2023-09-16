/* eslint-disable no-shadow */
const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((card) => res.status(200).send(card))
    .catch(() => res.status(500).send({ message: 'Server Error' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      Card.findById(card._id)
        .populate('owner')
        .then((card) => res.status(201).send(card))
        .catch(() => res.status(404).send({ message: 'card not found' }));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: `${Object.values(err.errors).map((err) => err.message).join(', ')}`,
        });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('NotValiId'))
    .then(() => res.status(200).send({ message: 'карточка удалена' }))
    .catch((err) => {
      if (err.message === 'NotValiId') {
        return res.status(404).send({ message: 'card not found' });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: 'invalid id',
        });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotValiId'))
    .populate(['owner', 'likes'])
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message === 'NotValiId') {
        return res.status(404).send({
          message: 'User not found',
        });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: 'incorrect user ID',
        });
      }
      if (err.message === 'NotValiId') {
        return res.status(404).send({
          message: 'User not found',
        });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const removeLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotValiId'))
    .populate(['owner', 'likes'])
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message === 'NotValiId') {
        return res.status(404).send({
          message: 'User not found',
        });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: 'incorrect user ID',
        });
      }
      if (err.message === 'NotValiId') {
        return res.status(404).send({
          message: 'User not found',
        });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

module.exports = {
  getCards, createCard, deleteCardById, likeCard, removeLike,
};
