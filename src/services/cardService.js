import cardRepository from "../repositories/cardRepository.js";
import AppError from "../middleware/AppError.js";

const getAll = async () => {
  return await cardRepository.getAll();
};

const getById = async (id) => {
  const card = await cardRepository.getById(id);

  if (!card) {
    throw new AppError("Card not found", 404);
  }

  return card;
};

const getByUserId = async (userId) => {
  return await cardRepository.getByUserId(userId);
};

const create = async (cardData, userId) => {
  try {
    const card = await cardRepository.create({
      ...cardData,
      user_id: userId,
    });

    return card;
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError("Business number already exists", 400);
    }

    throw error;
  }
};

const update = async (id, cardData, userId) => {
  const card = await cardRepository.getById(id);

  if (!card) {
    throw new AppError("Card not found", 404);
  }

  if (card.user_id.toString() !== userId.toString()) {
    throw new AppError("You are not allowed to edit this card", 403);
  }

  return await cardRepository.update(id, cardData);
};

const like = async (id, userId) => {
  const card = await cardRepository.getById(id);

  if (!card) {
    throw new AppError("Card not found", 404);
  }

  const alreadyLiked = card.likes.some(
    (likeId) => likeId.toString() === userId.toString(),
  );

  const likes = alreadyLiked
    ? card.likes.filter((likeId) => likeId.toString() !== userId.toString())
    : [...card.likes, userId];

  return await cardRepository.update(id, { likes });
};

const remove = async (id, userId, isAdmin) => {
  const card = await cardRepository.getById(id);

  if (!card) {
    throw new AppError("Card not found", 404);
  }

  const isOwner = card.user_id.toString() === userId.toString();

  if (!isOwner && !isAdmin) {
    throw new AppError("You are not allowed to delete this card", 403);
  }

  return await cardRepository.deleteById(id);
};

export default {
  getAll,
  getById,
  getByUserId,
  create,
  update,
  like,
  remove,
};
