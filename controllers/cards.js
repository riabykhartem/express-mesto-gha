const mongoose = require('mongoose');
const Card = require('../models/card');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

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
        .then((cardWithOwner) => res.status(201).send(cardWithOwner))
        .catch(() => res.status(404).send({ message: 'card not found' }));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: `${Object.values(err.errors).map((e) => e.message).join(', ')}`,
        });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        next(new ForbiddenError('Карточка другого пользователя'));
      }
      Card.deleteOne(card)
        .orFail()
        .then(() => res.status(200).send({ message: 'Карточка удалена' }))
        .catch((err) => {
          if (err instanceof mongoose.Error.DocumentNotFoundError) {
            next(new NotFoundError(`Карточка с _id: ${req.params.cardId} не найдена.`));
          } else if (err instanceof mongoose.Error.CastError) {
            next(new BadRequestError(`Некорректный _id карточки: ${req.params.cardId}`));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      if (err.name === 'TypeError') {
        next(new NotFoundError(`Карточка с _id: ${req.params.cardId} не найдена.`));
      } else {
        next(err);
      }
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
