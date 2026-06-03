import express from 'express';
import AuthController from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validationMiddleware.js';

const router = express.Router();

// Input validation schemas
const registerSchema = {
  username: { required: true, type: 'string', minLength: 3 },
  email: { 
    required: true, 
    type: 'string', 
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 
    message: 'Please provide a valid email address.' 
  },
  password: { required: true, type: 'string', minLength: 6 }
};

const loginSchema = {
  email: { required: true, type: 'string' },
  password: { required: true, type: 'string' }
};

// Public routes
router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.post('/logout', AuthController.logout);

// Protected routes
router.get('/profile', protect, AuthController.getProfile);

export default router;
