import bcrypt from "bcryptjs";
import userRepository from "../repositories/userRepository.js";
import AppError from "../middleware/AppError.js";

const createUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const userToCreate = {
    ...userData,
    password: hashedPassword,
  };

  try {
    return await userRepository.create(userToCreate);
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError("Email already exists", 400);
    }

    throw error;
  }
};
const getUsers = async () => {
  return await userRepository.findAll();
};

const getUserById = async (id) => {
  const user = await userRepository.findById(id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

const updateUser = async (id, userData) => {
  const updatedData = { ...userData };

  if (updatedData.password) {
    updatedData.password = await bcrypt.hash(updatedData.password, 10);
  }

  const user = await userRepository.updateById(id, updatedData);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

const updateBusinessStatus = async (id, isBusiness) => {
  const user = await userRepository.updateBusinessStatus(id, isBusiness);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

const deleteUser = async (id) => {
  const user = await userRepository.deleteById(id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};
export default {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateBusinessStatus,
  deleteUser,
};
