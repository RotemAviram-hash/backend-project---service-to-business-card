import logErrorToFile from "../utils/fileLogger.js";

const errorMiddleware = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || "Internal server error";

  if (err.name === "CastError") {
    status = 400;
    message = "Invalid ID";
  }

  logErrorToFile(status, message);

  return res.status(status).json({
    message,
  });
};

export default errorMiddleware;
