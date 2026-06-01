import AuthService from '../services/authService.js';
import ApiResponse from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Helper to construct cookie options.
 */
const getCookieOptions = () => {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: isProd, // HTTPS only in production
    sameSite: isProd ? 'strict' : 'lax',
  };
};

/**
 * Controller class for Authentication route handlers.
 */
class AuthController {
  /**
   * Registers a new user.
   * Route: POST /api/v1/auth/register
   */
  static register = asyncHandler(async (req, res) => {
    const { username, email, password, role } = req.body;
    
    // Create new account
    const { user, token } = await AuthService.registerUser(username, email, password, role);

    // Send JWT token in cookie for enhanced security
    res.cookie('token', token, getCookieOptions());

    res.status(201).json(
      ApiResponse.success(201, { user, token }, 'User registered successfully')
    );
  });

  /**
   * Logs in an existing user.
   * Route: POST /api/v1/auth/login
   */
  static login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate credentials
    const { user, token } = await AuthService.loginUser(email, password);

    // Send JWT token in cookie
    res.cookie('token', token, getCookieOptions());

    res.status(200).json(
      ApiResponse.success(200, { user, token }, 'User logged in successfully')
    );
  });

  /**
   * Logs out the currently authenticated user.
   * Route: POST /api/v1/auth/logout
   */
  static logout = asyncHandler(async (req, res) => {
    // Clear the secure token cookie
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000), // 10 seconds expiration
      httpOnly: true,
    });

    res.status(200).json(
      ApiResponse.success(200, null, 'User logged out successfully')
    );
  });

  /**
   * Yields profile information for the authenticated user.
   * Route: GET /api/v1/auth/profile
   */
  static getProfile = asyncHandler(async (req, res) => {
    // req.user is set by the auth middleware
    const user = await AuthService.getUserProfile(req.user.id);
    
    res.status(200).json(
      ApiResponse.success(200, { user }, 'User profile retrieved successfully')
    );
  });
}

export default AuthController;
