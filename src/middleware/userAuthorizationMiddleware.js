import AppError from "./AppError.js";

const userAuthorizationMiddleware = (req, res, next) => {
  const userId = req.user._id;
  const requestedUserId = req.params.id;

  if (req.user.isAdmin || userId.toString() === requestedUserId) {
    return next();
  }

  next(new AppError("Access denied", 403));
};

export default userAuthorizationMiddleware;
