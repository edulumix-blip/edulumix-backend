import express from 'express';
import {
  getJobs,
  getJobsGrouped,
  getJob,
  getJobBySlug,
  createJob,
  updateJob,
  deleteJob,
  likeJob,
  getMyJobs,
  fetchExternalJobs,
} from '../controllers/jobController.js';
import { protect, canPostJobs, optionalAuth, superAdminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Super Admin only - fetch external jobs (MUST be before /:id)
router.post('/fetch-external', protect, superAdminOnly, fetchExternalJobs);

// Protected routes (MUST come before parameterized routes)
router.get('/my/jobs', protect, getMyJobs);

// Public routes (optionalAuth allows super_admin to see all posts)
router.get('/', optionalAuth, getJobs);
router.get('/grouped', getJobsGrouped);
router.get('/slug/:slug', getJobBySlug);
router.get('/:id', getJob);
router.put('/:id/like', optionalAuth, likeJob);
router.post('/', protect, canPostJobs, createJob);
router.put('/:id', protect, canPostJobs, updateJob);
router.delete('/:id', protect, canPostJobs, deleteJob);

export default router;
