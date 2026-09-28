import User from "../models/Users.js";

const create = async (userData) => {
  return await User.create(userData);
};

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

const findAll = async () => {
  return await User.find();
};

const findById = async (id) => {
  return await User.findById(id);
};

const updateById = async (id, userData) => {
  return await User.findByIdAndUpdate(id, userData, {
    new: true,
    runValidators: true,
  });
};

const updateBusinessStatus = async (id, isBusiness) => {
  return await User.findByIdAndUpdate(
    id,
    { isBusiness },
    { new: true, runValidators: true },
  );
};

const deleteById = async (id) => {
  return await User.findByIdAndDelete(id);
};
export default {
  create,
  findByEmail,
  findAll,
  findById,
  updateById,
  updateBusinessStatus,
  deleteById,
};
