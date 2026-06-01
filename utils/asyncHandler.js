/**
 * Centralized async handler to catch uncaught promise rejections in Express routes
 * and forward them to the global error handler middleware.
 * @param {Function} fn - Async controller route function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
