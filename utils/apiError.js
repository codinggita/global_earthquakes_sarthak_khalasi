/**
 * Custom Error class for throwing structured API exceptions with status codes.
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP Status Code
   * @param {string} message - Descriptive error message
   * @param {array|object} [errors=null] - Granular validation error messages
   * @param {string} [stack=''] - Custom error stack trace
   */
  constructor(statusCode, message = 'An error occurred', errors = null, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
