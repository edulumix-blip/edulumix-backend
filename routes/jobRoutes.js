import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  getJobs,
  getJobStats,
  getJobsGrouped,
  getJob,
  getJobBySlug,
  createJob,
  updateJob,
  deleteJob,
  likeJob,
  getMyJobs,
  fetchExternalJobs,
  getJobFilterOptions,
} from '../controllers/jobController.js';
import { protect, canPostJobs, optionalAuth, superAdminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();
const engagementLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { success: false, message: 'Too many engagement attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Super Admin only - fetch external jobs (MUST be before /:id)
router.post('/fetch-external', protect, superAdminOnly, fetchExternalJobs);

// Protected routes (MUST come before parameterized routes)
router.get('/my/jobs', protect, getMyJobs);

// Public routes (optionalAuth allows super_admin to see all posts)
router.get('/', optionalAuth, getJobs);
router.get('/stats', optionalAuth, getJobStats);
router.get('/filter-options', optionalAuth, getJobFilterOptions);
router.get('/grouped', optionalAuth, getJobsGrouped);
router.get('/slug/:slug', optionalAuth, getJobBySlug);
router.get('/:id', optionalAuth, getJob);
router.put('/:id/like', engagementLimiter, optionalAuth, likeJob);
router.post('/', protect, canPostJobs, createJob);
router.put('/:id', protect, canPostJobs, updateJob);
router.delete('/:id', protect, canPostJobs, deleteJob);

export default router;
