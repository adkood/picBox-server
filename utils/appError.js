class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    //so that when constructor is called it not added to stacktrace and will not pollute it
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
