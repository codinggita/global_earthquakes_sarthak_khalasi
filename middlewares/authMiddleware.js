import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/apiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Middleware to verify that the request is authenticated with a valid JWT.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token = null;

  // 1. Extract token from Authorization Bearer header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // 2. Fallback: Extract token from cookies (if any parsed)
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Check if token exists
  if (!token || token === 'none') {
    throw new ApiError(401, 'Access denied. No authentication token provided.');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from database (make sure they still exist and are not soft-deleted)
    const user = await User.findById(decoded.id).where({ isDeleted: false });
    if (!user) {
      throw new ApiError(401, 'The user belonging to this token no longer exists.');
    }

    // Attach user payload to request context
    req.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    throw new ApiError(401, 'Access denied. Invalid or expired authentication token.');
  }
});

/**
 * Middleware to restrict access to specific user roles (RBAC).
 * @param {...string} roles - Permitted user roles (e.g., 'admin')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required to perform this action.'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `User role [${req.user.role}] is not authorized to access this resource.`
        )
      );
    }

    next();
  };
};

export { protect, authorize };
