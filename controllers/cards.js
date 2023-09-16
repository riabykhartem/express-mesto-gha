/* eslint-disable no-shadow */
const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: `${Object.values(err.errors).map((err) => err.message).join(', ')}`,
        });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
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
    .then(() => res.status(200).send({ message: 'карточка удалена' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: `${Object.values(err.errors).map((err) => err.message).join(', ')}`,
        });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .populate(['owner', 'likes'])
  .then((card) => {
    if (!card) {
      return res.status(404).send({ message: 'not found' });
    }
    return res.status(200).send(card);
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(400).send({
        message: `${Object.values(err.errors).map((err) => err.message).join(', ')}`,
      });
    }

    return res.status(500).send({ message: 'Server Error' });
  });

const removeLike = (req, res) => {
  Card.findByIdAndRemove(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
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
  getCards, createCard, deleteCardById, likeCard, removeLike,
};
