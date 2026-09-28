import jwt from "jsonwebtoken";
import AppError from "./AppError.js";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("Authentication required", 401);
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new AppError("Invalid authorization format", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    next(new AppError("Invalid or expired token", 401));
  }
};

export default authMiddleware;
