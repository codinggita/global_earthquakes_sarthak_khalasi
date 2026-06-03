import ApiResponse from '../utils/apiResponse.js';
import ApiError from '../utils/apiError.js';

/**
 * Global Express centralized error handling middleware.
 */
const errorMiddleware = (err, req, res, next) => {
  let error = err;

  // Log error console warning in development mode
  if (process.env.NODE_ENV === 'development') {
    console.error(`[Express-Error-Catcher] Error caught: ${err.message}`, err);
  }

  // Handle Mongoose Bad ObjectID (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with id of: ${err.value}`;
    error = new ApiError(404, message);
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message).join(', ');
    const detailedErrors = {};
    Object.keys(err.errors).forEach((key) => {
      detailedErrors[key] = err.errors[key].message;
    });
    error = new ApiError(400, `Validation Failed: ${message}`, detailedErrors);
  }

  // Handle Mongoose Duplicate Key (11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate value entered for ${field} field. Value must be unique.`;
    error = new ApiError(400, message);
  }

  // Handle JWT Signature Error
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid authentication token. Please log in again.');
  }

  // Handle JWT Expiry Error
  if (err.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Authentication token expired. Please log in again.');
  }

  // Default to 500 Internal Server Error if status code not set
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  const errors = error.errors || null;
  const stack = error.stack || null;

  res.status(statusCode).json(
    ApiResponse.error(statusCode, message, errors, stack)
  );
};

export default errorMiddleware;
