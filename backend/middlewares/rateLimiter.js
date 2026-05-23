import rateLimit from 'express-rate-limit';
import ApiResponse from '../utils/apiResponse.js';

/**
 * Configure rate limiter to allow max 100 requests per 15 minutes per IP address.
 */
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json(
      ApiResponse.error(
        options.statusCode,
        'Too many requests from this IP. Please try again after 15 minutes.'
      )
    );
  },
});

export default rateLimiter;
