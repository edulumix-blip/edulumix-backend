import express from 'express';
import {
  getMockTests,
  getAllMockTests,
  getFeaturedMockTests,
  getMockTest,
  getMockTestById,
  createMockTest,
  updateMockTest,
  deleteMockTest,
  togglePublish,
  toggleFeatured,
  submitTestResult,
  getMockTestsCount,
} from '../controllers/mockTestController.js';
import { protect, superAdminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin routes (Super Admin only) - MUST come before parameterized routes
router.get('/all', protect, superAdminOnly, getAllMockTests);
router.get('/id/:id', protect, superAdminOnly, getMockTestById);
router.put('/:id/toggle-publish', protect, superAdminOnly, togglePublish);
router.put('/:id/toggle-featured', protect, superAdminOnly, toggleFeatured);

// Public routes
router.get('/', getMockTests);
router.get('/featured', getFeaturedMockTests);
router.get('/count', getMockTestsCount);

// CRUD routes
router.post('/', protect, superAdminOnly, createMockTest);
router.put('/:id', protect, superAdminOnly, updateMockTest);
router.delete('/:id', protect, superAdminOnly, deleteMockTest);
router.post('/:id/submit', protect, submitTestResult);

// This must be last as it catches /:slug
router.get('/:slug', getMockTest);

export default router;
