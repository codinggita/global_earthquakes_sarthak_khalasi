/**
 * Standardized API Response structure helper.
 */
class ApiResponse {
  /**
   * Generates a successful response object.
   * @param {number} statusCode - HTTP Status Code
   * @param {*} data - Payload returned by the endpoint
   * @param {string} message - Descriptive success message
   * @param {object} [meta=null] - Pagination or additional query metadata
   */
  static success(statusCode, data, message = 'Success', meta = null) {
    return {
      success: true,
      statusCode,
      message,
      data,
      ...(meta && { meta }),
    };
  }

  /**
   * Generates an error response object.
   * @param {number} statusCode - HTTP Status Code
   * @param {string} message - Error explanation
   * @param {string|object|array} [errors=null] - Granular validation error messages
   * @param {string} [stack=null] - Dev stack trace for debugging
   */
  static error(statusCode, message = 'Error', errors = null, stack = null) {
    return {
      success: false,
      statusCode,
      message,
      ...(errors && { errors }),
      ...(stack && process.env.NODE_ENV === 'development' && { stack }),
    };
  }
}

export default ApiResponse;
