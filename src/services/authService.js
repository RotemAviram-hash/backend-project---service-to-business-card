import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import userRepository from "../repositories/userRepository.js";
import AppError from "../middleware/AppError.js";

const login = async (email, password) => {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const payload = {
    _id: user._id,
    isBusiness: user.isBusiness,
    isAdmin: user.isAdmin,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

  return token;
};

export default {
  login,
};
