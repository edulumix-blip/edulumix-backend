import Blog from '../models/Blog.js';
import User from '../models/User.js';

// @desc    Get all blogs (Super Admin - includes unpublished and soft-deleted)
// @route   GET /api/blogs/all
// @access  Private (super_admin only)
export const getAllBlogs = async (req, res) => {
  try {
    const { author } = req.query;
    
    const query = {};
    // Super admin sees ALL blogs including soft-deleted
    if (author) query.author = author;

    const blogs = await Blog.find(query)
      .populate('author', 'name email avatar role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all published blogs (public)
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req, res) => {
  try {
    const { category, tag, search, page = 1, limit = 10 } = req.query;

    const query = { isPublished: true };

    // Public/contributors should not see soft-deleted blogs
    if (!req.user || req.user.role !== 'super_admin') {
      query.isDeleted = { $ne: true }; // Show posts where isDeleted is false OR doesn't exist
    }

    if (category) query.category = category;
    if (tag) query.tags = { $in: [tag] };
    if (search) {
      query.$text = { $search: search };
    }

    const blogs = await Blog.find(query)
      .populate('author', 'name email avatar role')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Blog.countDocuments(query);

    res.status(200).json({
      success: true,
      count: blogs.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get featured blogs
// @route   GET /api/blogs/featured
// @access  Public
export const getFeaturedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true, isFeatured: true })
      .populate('author', 'name email avatar role')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single blog by slug
// @route   GET /api/blogs/:slug
// @access  Public
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true })
      .populate('author', 'name email avatar bio role');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create blog
// @route   POST /api/blogs
// @access  Private (blog_poster, tech_blog_poster, super_admin)
export const createBlog = async (req, res) => {
  try {
    const blogData = {
      ...req.body,
      author: req.user.id,
      excerpt: req.body.excerpt || req.body.content.substring(0, 200) + '...',
    };

    const blog = await Blog.create(blogData);

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
      message: 'Blog created successfully. You earned 1 point!',
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private (owner or super_admin)
export const updateBlog = async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    // Check ownership
    if (blog.author.toString() !== req.user.id && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this blog',
      });
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private (owner or super_admin)
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    // Check ownership
    if (blog.author.toString() !== req.user.id && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this blog',
      });
    }

    // Super admin: Permanently delete
    if (req.user.role === 'super_admin') {
      await Blog.findByIdAndDelete(req.params.id);
      
      return res.status(200).json({
        success: true,
        message: 'Blog permanently deleted',
      });
    }

    // Contributor: Soft delete (mark as deleted)
    blog.isDeleted = true;
    blog.deletedAt = new Date();
    await blog.save();

    // Deduct 1 point from user (except super_admin)
    if (req.user.role !== 'super_admin') {
      try {
        const updatedUser = await User.findByIdAndUpdate(
          blog.author, 
          { $inc: { points: -1 } },
          { new: true, runValidators: true }
        );
        // Ensure points don't go below 0
        if (updatedUser.points < 0) {
          await User.findByIdAndUpdate(blog.author, { points: 0 });
        }
        console.log(`Points deducted for user ${blog.author}: ${updatedUser.points}`);
      } catch (pointsError) {
        console.error('Error updating points:', pointsError);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully. 1 point deducted.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Like blog
// @route   PUT /api/blogs/:id/like
// @access  Public
export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    blog.likes += 1;
    await blog.save();

    res.status(200).json({
      success: true,
      likes: blog.likes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get my blogs
// @route   GET /api/blogs/my-blogs
// @access  Private
export const getMyBlogs = async (req, res) => {
  try {
    // Contributors should not see their soft-deleted blogs
    const blogs = await Blog.find({ author: req.user.id, isDeleted: { $ne: true } })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
