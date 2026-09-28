import AppError from "./AppError.js";

const businessMiddleware = (req, res, next) => {
  if (!req.user?.isBusiness) {
    return next(
      new AppError("Only business users can perform this action", 403),
    );
  }

  next();
};

export default businessMiddleware;
