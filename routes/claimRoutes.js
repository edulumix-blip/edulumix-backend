import express from 'express';
import {
  createClaim,
  getMyClaims,
  getAllClaims,
  getPendingClaimsCount,
  updateClaim,
  getClaimStats,
} from '../controllers/claimController.js';
import { protect, superAdminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Contributor routes
router.post('/', protect, createClaim);
router.get('/my-claims', protect, getMyClaims);

// Super Admin routes
router.get('/stats', protect, superAdminOnly, getClaimStats);
router.get('/pending/count', protect, superAdminOnly, getPendingClaimsCount);
router.get('/', protect, superAdminOnly, getAllClaims);
router.put('/:id', protect, superAdminOnly, updateClaim);

export default router;
