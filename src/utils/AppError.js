class AppError extends Error {
  /**
   * @param {number} statusCode HTTP status code
   * @param {string} code A short error code (e.g., 'NOT_FOUND')
   * @param {string} message Human-friendly message
   * @param {any} details Optional additional details
   */
  constructor(statusCode = 500, code = 'INTERNAL_ERROR', message = 'Internal Server Error', details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true; // mark as trusted/expected error
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
