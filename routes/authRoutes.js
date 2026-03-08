import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  signup,
  login,
  firebaseLogin,
  getMe,
  updateProfile,
  changePassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rate limiting for auth (10 req/min per IP for login/signup)
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public routes (with rate limiting)
router.post('/signup', authLimiter, signup);
router.post('/login', authLimiter, login);
router.post('/firebase-login', authLimiter, firebaseLogin);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

export default router;
