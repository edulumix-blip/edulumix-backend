import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  getResources,
  getResourcesGrouped,
  getResource,
  createResource,
  updateResource,
  deleteResource,
  likeResource,
  incrementDownload,
  getMyResources,
  fetchExternalResources,
  getResourceFilterOptions,
} from '../controllers/resourceController.js';
import { protect, canPostResources, optionalAuth, superAdminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();
const engagementLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { success: false, message: 'Too many engagement attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Super Admin only - fetch external resources (MUST be before /:id)
router.post('/fetch-external', protect, superAdminOnly, fetchExternalResources);

// Protected routes (MUST come before parameterized routes)
router.get('/my/resources', protect, getMyResources);

// Public routes (optionalAuth allows super_admin to see all posts)
router.get('/', optionalAuth, getResources);
router.get('/filter-options', optionalAuth, getResourceFilterOptions);
router.get('/grouped', getResourcesGrouped);
router.get('/:id', optionalAuth, getResource);
router.put('/:id/like', engagementLimiter, likeResource);
router.put('/:id/download', engagementLimiter, incrementDownload);
router.post('/', protect, canPostResources, createResource);
router.put('/:id', protect, canPostResources, updateResource);
router.delete('/:id', protect, canPostResources, deleteResource);

export default router;
