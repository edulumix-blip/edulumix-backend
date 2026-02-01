import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        });
      }

      // Check if user is approved
      if (req.user.status !== 'approved' && req.user.role !== 'super_admin') {
        return res.status(403).json({
          success: false,
          message: 'Your account is not approved yet',
          status: req.user.status,
        });
      }

      next();
    } catch (error) {
      console.error('Auth Error:', error);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token invalid',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }
};

// Optional auth - sets user if token exists, otherwise continues
export const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Token invalid, but that's okay for optional auth
      req.user = null;
    }
  }

  next();
};

// Check if user is Super Admin
export const superAdminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'super_admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Super Admin only.',
    });
  }
};

// Check if user has specific role(s)
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};

// Check if user can post jobs
export const canPostJobs = (req, res, next) => {
  const allowedRoles = ['super_admin', 'job_poster'];
  if (allowedRoles.includes(req.user.role)) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to post jobs',
    });
  }
};

// Check if user can post resources
export const canPostResources = (req, res, next) => {
  const allowedRoles = ['super_admin', 'resource_poster'];
  if (allowedRoles.includes(req.user.role)) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to post resources',
    });
  }
};

// Check if user can post blogs
export const canPostBlogs = (req, res, next) => {
  const allowedRoles = ['super_admin', 'blog_poster', 'tech_blog_poster'];
  if (allowedRoles.includes(req.user.role)) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to post blogs',
    });
  }
};

// Check if user can post digital products
export const canPostProducts = (req, res, next) => {
  const allowedRoles = ['super_admin', 'digital_product_poster'];
  if (allowedRoles.includes(req.user.role)) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to post digital products',
    });
  }
};
