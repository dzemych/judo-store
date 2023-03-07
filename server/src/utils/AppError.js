class AppError extends Error {
   constructor(message, statusCode = 500) {
      super(message);

      this.statusCode = statusCode
      this.isOperational = true

      Error.captureStackTrace(this)
   }
}

module.exports = AppError