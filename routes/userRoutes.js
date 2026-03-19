import express from 'express';
import {
  getPendingUsers,
  getApprovedUsers,
  getAllUsers,
  getAllPublicUsers,
  getUserById,
  approveUser,
  rejectUser,
  blockUser,
  unblockUser,
  changeUserRole,
  deleteUser,
  getDashboardStats,
} from '../controllers/userController.js';
import { protect, superAdminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route MUST be before any /:id to avoid "all-public" being matched as id
router.get('/all-public', getAllPublicUsers);

// All other routes require authentication and super admin access
router.use(protect, superAdminOnly);

router.get('/pending', getPendingUsers);
router.get('/approved', getApprovedUsers);
router.get('/', getAllUsers);
router.get('/stats', getDashboardStats);
router.get('/:id', getUserById);

router.put('/:id/approve', approveUser);
router.put('/:id/reject', rejectUser);
router.put('/:id/block', blockUser);
router.put('/:id/unblock', unblockUser);
router.put('/:id/role', changeUserRole);
router.delete('/:id', deleteUser);

export default router;
