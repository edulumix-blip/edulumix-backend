import express from 'express';
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
} from '../controllers/blogController.js';
import { protect, canPostBlogs, superAdminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes (MUST come before parameterized routes)
router.get('/my/blogs', protect, getMyBlogs);
router.get('/all', protect, superAdminOnly, getAllBlogs);

// Public routes
router.get('/', getBlogs);
router.get('/featured', getFeaturedBlogs);
router.get('/:slug', getBlogBySlug);
router.put('/:id/like', likeBlog);
router.post('/', protect, canPostBlogs, createBlog);
router.put('/:id', protect, canPostBlogs, updateBlog);
router.delete('/:id', protect, canPostBlogs, deleteBlog);

export default router;
