import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";

import userRepository from "../repositories/userRepository.js";
import AppError from "../middleware/AppError.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

const googleLogin = async (idToken) => {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  console.log("GOOGLE PAYLOAD:", payload);

  const user = await userRepository.findByEmail(payload.email);

  console.log("LOCAL USER:", user);

  if (user) {
    if (user.isAdmin || user.isBusiness) {
      throw new AppError(
        "Google login is only available for regular users",
        403,
      );
    }

    const jwtPayload = {
      _id: user._id,
      isBusiness: user.isBusiness,
      isAdmin: user.isAdmin,
    };

    return jwt.sign(jwtPayload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  }

  const randomPassword = crypto.randomBytes(32).toString("hex");
  const hashedPassword = await bcrypt.hash(randomPassword, 10);

  const newUser = {
    name: {
      first: payload.given_name,
      middle: "",
      last: payload.family_name,
    },
    phone: "Not provided",
    email: payload.email,
    image: {
      url: payload.picture,
      alt: "Google profile picture",
    },
    password: hashedPassword,
    address: {
      state: "Not provided",
      country: "Not provided",
      city: "Not provided",
      street: "Not provided",
      houseNumber: 1,
      zip: 0,
    },
    isAdmin: false,
    isBusiness: false,
  };

  const createdUser = await userRepository.create(newUser);

  const jwtPayload = {
    _id: createdUser._id,
    isBusiness: createdUser.isBusiness,
    isAdmin: createdUser.isAdmin,
  };

  return jwt.sign(jwtPayload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};
export default {
  login,
  googleLogin,
};
