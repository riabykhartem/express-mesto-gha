const mongoose = require('mongoose');
const Card = require('../models/card');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((card) => res.status(200).send(card))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      Card.findById(card._id)
        .populate('owner')
        .then((cardWithOwner) => res.status(201).send(cardWithOwner))
        .catch(() => next(new NotFoundError('card not found')));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new NotFoundError('карточка не найдена'));
      }
      next(err);
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
const likeCard = (req, res, next) => {
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
        next(new NotFoundError('карточка не найдена'));
      }
      if (err.name === 'CastError') {
        next(new BadRequestError('некоректный id карточки'));
      }
      next(err);
    });
};

const removeLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotValiId'))
    .populate(['owner', 'likes'])
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('некоректный id карточки'));
      }
      if (err.message === 'NotValiId') {
        next(new NotFoundError('карточка не найдена'));
      }
      next(err);
    });
};

module.exports = {
  getCards, createCard, deleteCardById, likeCard, removeLike,
};
