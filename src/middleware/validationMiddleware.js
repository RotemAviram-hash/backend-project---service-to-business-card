import AppError from "./AppError.js";

const validationMiddleware = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }

    next();
  };
};

export default validationMiddleware;
