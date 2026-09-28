import AppError from "./AppError.js";

const adminMiddleware = (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(new AppError("Access denied", 403));
  }

  next();
};

export default adminMiddleware;
