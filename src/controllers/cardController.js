import cardService from "../services/cardService.js";

const getAll = async (req, res) => {
  const cards = await cardService.getAll();

  res.status(200).json(cards);
};

const getById = async (req, res) => {
  const card = await cardService.getById(req.params.id);

  res.status(200).json(card);
};

const getByUserId = async (req, res) => {
  const cards = await cardService.getByUserId(req.user._id);

  res.status(200).json(cards);
};

const create = async (req, res) => {
  const card = await cardService.create(req.body, req.user._id);

  res.status(201).json(card);
};

const update = async (req, res) => {
  const card = await cardService.update(req.params.id, req.body, req.user._id);

  res.status(200).json(card);
};

const like = async (req, res) => {
  const card = await cardService.like(req.params.id, req.user._id);

  res.status(200).json(card);
};

const remove = async (req, res) => {
  const card = await cardService.remove(
    req.params.id,
    req.user._id,
    req.user.isAdmin,
  );

  res.status(200).json(card);
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
