import express from 'express';
import {
  getCourses,
  getAllCourses,
  getFeaturedCourses,
  getCourse,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  togglePublish,
  toggleFeatured,
  getCoursesCount,
} from '../controllers/courseController.js';
import { protect, superAdminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin routes (Super Admin only) - MUST come before parameterized routes
router.get('/all', protect, superAdminOnly, getAllCourses);
router.get('/id/:id', protect, superAdminOnly, getCourseById);
router.put('/:id/toggle-publish', protect, superAdminOnly, togglePublish);
router.put('/:id/toggle-featured', protect, superAdminOnly, toggleFeatured);

// Public routes
router.get('/', getCourses);
router.get('/featured', getFeaturedCourses);
router.get('/count', getCoursesCount);

// CRUD routes
router.post('/', protect, superAdminOnly, createCourse);
router.put('/:id', protect, superAdminOnly, updateCourse);
router.delete('/:id', protect, superAdminOnly, deleteCourse);

// This must be last as it catches /:slug
router.get('/:slug', getCourse);

export default router;
