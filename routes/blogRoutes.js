import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  getBlogs,
  getAllBlogs,
  getFeaturedBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  getMyBlogs,
  fetchExternalBlogs,
} from '../controllers/blogController.js';
import { protect, canPostBlogs, superAdminOnly, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();
const engagementLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { success: false, message: 'Too many engagement attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Protected routes (MUST come before parameterized routes)
router.post('/fetch-external', protect, superAdminOnly, fetchExternalBlogs);
router.get('/my/blogs', protect, getMyBlogs);
router.get('/all', protect, superAdminOnly, getAllBlogs);

// Public routes
router.get('/', optionalAuth, getBlogs);
router.get('/featured', optionalAuth, getFeaturedBlogs);
router.get('/:slug', optionalAuth, getBlogBySlug);
router.put('/:id/like', engagementLimiter, optionalAuth, likeBlog);
router.post('/', protect, canPostBlogs, createBlog);
router.put('/:id', protect, canPostBlogs, updateBlog);
router.delete('/:id', protect, canPostBlogs, deleteBlog);

export default router;
