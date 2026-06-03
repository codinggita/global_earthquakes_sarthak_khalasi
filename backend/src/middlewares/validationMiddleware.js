import ApiError from '../utils/apiError.js';

/**
 * Validates request body fields against a specified validation schema.
 * Fulfills Custom Data Validation Layer (Good-to-have #5).
 */
export const validate = (schema) => {
  return (req, res, next) => {
    const errors = [];
    
    Object.keys(schema).forEach((field) => {
      const rules = schema[field];
      const val = req.body[field];

      // Check required
      if (rules.required && (val === undefined || val === null || val === '')) {
        errors.push(`${field} is required.`);
        return;
      }

      if (val !== undefined && val !== null && val !== '') {
        // Check type
        if (rules.type && typeof val !== rules.type) {
          errors.push(`${field} must be of type ${rules.type}.`);
        }

        // Check minLength
        if (rules.minLength && typeof val === 'string' && val.length < rules.minLength) {
          errors.push(`${field} must be at least ${rules.minLength} characters.`);
        }

        // Check regex match
        if (rules.match && !rules.match.test(val)) {
          errors.push(rules.message || `${field} format is invalid.`);
        }

        // Custom validation function
        if (rules.validate && !rules.validate(val)) {
          errors.push(rules.message || `${field} is invalid.`);
        }
      }
    });

    if (errors.length > 0) {
      return next(new ApiError(400, `Validation Error: ${errors.join(' ')}`));
    }

    next();
  };
};
