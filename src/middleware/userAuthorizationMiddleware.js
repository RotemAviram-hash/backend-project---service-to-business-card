import AppError from "./AppError.js";

const userAuthorizationMiddleware = (allowAdmin = false) => {
  return (req, res, next) => {
    const userId = req.user._id;
    const requestedUserId = req.params.id;

    const isSameUser = userId.toString() === requestedUserId;

    if (isSameUser || (allowAdmin && req.user.isAdmin)) {
      return next();
    }

    next(new AppError("Access denied", 403));
  };
};
export default userAuthorizationMiddleware;
