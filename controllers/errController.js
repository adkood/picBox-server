const AppError = require("../utils/appError");

const handleErrorProd = (err, res) => {
  // if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  // }
  // else
  // {

  // }
};

const handleErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const handle_jwt_invalidTokken_Error = () => {
  return new AppError("tokken is invalid! please login again.", 401);
};

const handle_jwt_tokkenExpired_Error = () => {
  return new AppError("tokken has expired! please login again.", 401);
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    if (error === "JsonWebTokenError") {
      error = handle_jwt_invalidTokken_Error();
    }
    if(error === "TokenExpiredError") {
      error = handle_jwt_tokkenExpired_Error();
    }

    handleErrorProd(error, res);
  } else if (process.env.NODE_ENV === "development") {
    handleErrorDev(err, res);
  }
};
