import express from 'express';
import {
  getProducts,
  getAllProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  getProductsCount,
  toggleAvailability,
  toggleFeatured,
} from '../controllers/productController.js';
import { protect, canPostProducts, superAdminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes (MUST come before parameterized routes)
router.get('/my/products', protect, getMyProducts);

// Admin routes
router.get('/all', protect, superAdminOnly, getAllProducts);
router.put('/:id/toggle-availability', protect, superAdminOnly, toggleAvailability);
router.put('/:id/toggle-featured', protect, superAdminOnly, toggleFeatured);

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/count', getProductsCount);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProduct);
router.post('/', protect, canPostProducts, createProduct);
router.put('/:id', protect, canPostProducts, updateProduct);
router.delete('/:id', protect, canPostProducts, deleteProduct);

export default router;
