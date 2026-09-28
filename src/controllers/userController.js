import userService from "../services/userService.js";

const createUser = async (req, res) => {
  const user = await userService.createUser(req.body);

  res.status(201).json(user);
};

const getUsers = async (req, res) => {
  const users = await userService.getUsers();

  res.status(200).json(users);
};

const getUserById = async (req, res) => {
  const user = await userService.getUserById(req.params.id);

  res.status(200).json(user);
};

const updateUser = async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);

  res.status(200).json(user);
};

const updateBusinessStatus = async (req, res) => {
  const user = await userService.updateBusinessStatus(
    req.params.id,
    req.body.isBusiness,
  );

  res.status(200).json(user);
};

const deleteUser = async (req, res) => {
  await userService.deleteUser(req.params.id);

  res.status(200).json({
    message: "User deleted successfully",
  });
};

export default {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateBusinessStatus,
  deleteUser,
};
