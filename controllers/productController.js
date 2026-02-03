import DigitalProduct from '../models/DigitalProduct.js';
import User from '../models/User.js';

// @desc    Get all products (public)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { category, subcategory, search, page = 1, limit = 12 } = req.query;

    const query = { isAvailable: true };

    if (category) query.category = category;
    if (subcategory) query.subcategory = { $regex: subcategory, $options: 'i' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { subcategory: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await DigitalProduct.find(query)
      .populate('postedBy', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await DigitalProduct.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all products (admin - all products)
// @route   GET /api/products/all
// @access  Private (Super Admin)
export const getAllProducts = async (req, res) => {
  try {
    const { category, isAvailable, isFeatured, search, page = 1, limit = 20 } = req.query;

    const query = {};

    if (category) query.category = category;
    if (isAvailable !== undefined) query.isAvailable = isAvailable === 'true';
    if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { subcategory: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await DigitalProduct.find(query)
      .populate('postedBy', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await DigitalProduct.countDocuments(query);

    // Stats
    const stats = {
      total: await DigitalProduct.countDocuments(),
      available: await DigitalProduct.countDocuments({ isAvailable: true }),
      unavailable: await DigitalProduct.countDocuments({ isAvailable: false }),
      featured: await DigitalProduct.countDocuments({ isFeatured: true }),
      totalViews: await DigitalProduct.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]).then(r => r[0]?.total || 0),
    };

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      stats,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await DigitalProduct.find({ isAvailable: true, isFeatured: true })
      .populate('postedBy', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
export const getProductsByCategory = async (req, res) => {
  try {
    const products = await DigitalProduct.find({ 
      category: req.params.category,
      isAvailable: true 
    })
      .populate('postedBy', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res) => {
  try {
    const product = await DigitalProduct.findById(req.params.id).populate('postedBy', 'name email avatar');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Increment views
    product.views += 1;
    await product.save();

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private (digital_product_poster, super_admin)
export const createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      postedBy: req.user.id,
    };

    const product = await DigitalProduct.create(productData);

    // Add 1 point to user (except super_admin)
    if (req.user.role !== 'super_admin') {
      try {
        const updatedUser = await User.findByIdAndUpdate(
          req.user.id, 
          { $inc: { points: 1 } },
          { new: true, runValidators: true }
        );
        console.log(`Points updated for user ${req.user.id}: ${updatedUser.points}`);
      } catch (pointsError) {
        console.error('Error updating points:', pointsError);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Product added successfully. You earned 1 point!',
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (owner or super_admin)
export const updateProduct = async (req, res) => {
  try {
    let product = await DigitalProduct.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check ownership
    if (product.postedBy.toString() !== req.user.id && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product',
      });
    }

    product = await DigitalProduct.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (owner or super_admin)
export const deleteProduct = async (req, res) => {
  try {
    const product = await DigitalProduct.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check ownership
    if (product.postedBy.toString() !== req.user.id && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product',
      });
    }

    await DigitalProduct.findByIdAndDelete(req.params.id);

    // Deduct 1 point from user (except super_admin)
    if (req.user.role !== 'super_admin') {
      try {
        const updatedUser = await User.findByIdAndUpdate(
          product.postedBy, 
          { $inc: { points: -1 } },
          { new: true, runValidators: true }
        );
        // Ensure points don't go below 0
        if (updatedUser.points < 0) {
          await User.findByIdAndUpdate(product.postedBy, { points: 0 });
        }
        console.log(`Points deducted for user ${product.postedBy}: ${updatedUser.points}`);
      } catch (pointsError) {
        console.error('Error updating points:', pointsError);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully. 1 point deducted.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get my products
// @route   GET /api/products/my-products
// @access  Private
export const getMyProducts = async (req, res) => {
  try {
    const products = await DigitalProduct.find({ postedBy: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get products count
// @route   GET /api/products/count
// @access  Public
export const getProductsCount = async (req, res) => {
  try {
    const count = await DigitalProduct.countDocuments({ isAvailable: true });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Toggle product availability
// @route   PUT /api/products/:id/toggle-availability
// @access  Private (Super Admin)
export const toggleAvailability = async (req, res) => {
  try {
    const product = await DigitalProduct.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    product.isAvailable = !product.isAvailable;
    await product.save();

    res.status(200).json({
      success: true,
      message: `Product ${product.isAvailable ? 'made available' : 'made unavailable'}`,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Toggle product featured
// @route   PUT /api/products/:id/toggle-featured
// @access  Private (Super Admin)
export const toggleFeatured = async (req, res) => {
  try {
    const product = await DigitalProduct.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    product.isFeatured = !product.isFeatured;
    await product.save();

    res.status(200).json({
      success: true,
      message: `Product ${product.isFeatured ? 'featured' : 'unfeatured'}`,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};