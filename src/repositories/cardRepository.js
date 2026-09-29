import Card from "../models/Card.js";

const getAll = () => {
  return Card.find();
};

const getById = (id) => {
  return Card.findById(id);
};

const getByUserId = (userId) => {
  return Card.find({ user_id: userId });
};

const create = (cardData) => {
  return Card.create(cardData);
};

const update = (id, cardData) => {
  return Card.findByIdAndUpdate(id, cardData, {
    new: true,
    runValidators: true,
  });
};

const deleteById = (id) => {
  return Card.findByIdAndDelete(id);
};
const findByBizNumber = (bizNumber) => {
  return Card.findOne({ bizNumber });
};

export default {
  getAll,
  getById,
  getByUserId,
  create,
  update,
  deleteById,
  findByBizNumber,
};
