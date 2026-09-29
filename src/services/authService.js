import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import userRepository from "../repositories/userRepository.js";
import AppError from "../middleware/AppError.js";

const login = async (email, password) => {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  if (user.blockedUntil) {
    if (user.blockedUntil > new Date()) {
      throw new AppError("Account is temporarily blocked", 403);
    }

    await userRepository.updateById(user._id, {
      failedLoginAttempts: 0,
      blockedUntil: null,
    });

    user.failedLoginAttempts = 0;
    user.blockedUntil = null;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    const failedAttempts = user.failedLoginAttempts + 1;

    if (failedAttempts >= 3) {
      const blockedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await userRepository.updateById(user._id, {
        failedLoginAttempts: failedAttempts,
        blockedUntil,
      });

      throw new AppError("Account is temporarily blocked", 403);
    }

    await userRepository.updateById(user._id, {
      failedLoginAttempts: failedAttempts,
    });

    throw new AppError("Invalid email or password", 401);
  }
  // קטע הקוד שמטפל ברצפים
  if (user.failedLoginAttempts > 0 || user.blockedUntil) {
    await userRepository.updateById(user._id, {
      failedLoginAttempts: 0,
      blockedUntil: null,
    });
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
