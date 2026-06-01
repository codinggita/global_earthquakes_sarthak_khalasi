import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/apiError.js';

/**
 * Signs a web token with the user's MongoDB ID.
 * @param {string} id - Mongoose User ID
 * @returns {string} Signed JWT Token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Service class for Authentication operations.
 */
class AuthService {
  /**
   * Registers a new user account in the system.
   */
  static async registerUser(username, email, password, role = 'user') {
    // 1. Check if user already exists (by email or username)
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      throw new ApiError(400, 'A user with that email already exists.');
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      throw new ApiError(400, 'A user with that username already exists.');
    }

    // 2. Create the user
    const user = await User.create({
      username,
      email,
      password,
      role,
    });

    // 3. Return user object and token (hiding the password since Mongoose select is false)
    const token = generateToken(user._id);

    return {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  /**
   * Log in an existing user.
   */
  static async loginUser(email, password) {
    // 1. Find user, explicitly selecting the password since it has select: false
    const user = await User.findOne({ email, isDeleted: false }).select('+password');
    if (!user) {
      throw new ApiError(401, 'Invalid credentials.');
    }

    // 2. Compare passwords
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid credentials.');
    }

    // 3. Generate token
    const token = generateToken(user._id);

    return {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  /**
   * Retrieves profile details for a user.
   */
  static async getUserProfile(userId) {
    const user = await User.findById(userId).where({ isDeleted: false });
    if (!user) {
      throw new ApiError(404, 'User profile not found.');
    }
    return user;
  }
}

export default AuthService;
export { generateToken };
