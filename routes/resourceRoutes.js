import express from 'express';
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
} from '../controllers/resourceController.js';
import { protect, canPostResources, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes (MUST come before parameterized routes)
router.get('/my/resources', protect, getMyResources);

// Public routes (optionalAuth allows super_admin to see all posts)
router.get('/', optionalAuth, getResources);
router.get('/grouped', getResourcesGrouped);
router.get('/:id', getResource);
router.put('/:id/like', likeResource);
router.put('/:id/download', incrementDownload);
router.post('/', protect, canPostResources, createResource);
router.put('/:id', protect, canPostResources, updateResource);
router.delete('/:id', protect, canPostResources, deleteResource);

export default router;
