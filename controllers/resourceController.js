import Resource from '../models/Resource.js';
import User from '../models/User.js';

// @desc    Get all resources (public, super_admin sees all including deleted)
// @route   GET /api/resources
// @access  Public (optionalAuth for super_admin)
export const getResources = async (req, res) => {
  try {
    const { category, subcategory, search, page = 1, limit = 12 } = req.query;

    const query = {};

    // Public/contributors should not see soft-deleted resources
    // Super admin can see all resources (including soft-deleted)
    if (!req.user || req.user.role !== 'super_admin') {
      query.isDeleted = { $ne: true }; // Show posts where isDeleted is false OR doesn't exist
    }

    if (category) query.category = category;
    if (subcategory) query.subcategory = { $regex: subcategory, $options: 'i' };
    if (search) {
      query.$text = { $search: search };
    }

    const resources = await Resource.find(query)
      .populate('postedBy', 'name email avatar role')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Resource.countDocuments(query);

    res.status(200).json({
      success: true,
      count: resources.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: resources,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get resources grouped by category
// @route   GET /api/resources/grouped
// @access  Public
export const getResourcesGrouped = async (req, res) => {
  try {
    const categories = [
      'Software Notes',
      'Interview Notes',
      'Tools & Technology',
      'Trending Technology',
      'Video Resources',
      'Software Project',
      'Hardware Project',
    ];

    const groupedResources = {};

    for (const category of categories) {
      const resources = await Resource.find({ category })
        .populate('postedBy', 'name email avatar role')
        .sort({ createdAt: -1 })
        .limit(8);

      if (resources.length > 0) {
        groupedResources[category] = {
          resources,
          total: await Resource.countDocuments({ category }),
        };
      }
    }

    res.status(200).json({
      success: true,
      data: groupedResources,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single resource
// @route   GET /api/resources/:id
// @access  Public
export const getResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id).populate('postedBy', 'name email avatar role');

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    res.status(200).json({
      success: true,
      data: resource,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create resource
// @route   POST /api/resources
// @access  Private (resource_poster, super_admin)
export const createResource = async (req, res) => {
  try {
    // Check if link is YouTube
    const link = req.body.link || '';
    const isVideo = link.includes('youtube.com') || link.includes('youtu.be');

    const resourceData = {
      ...req.body,
      isVideo,
      postedBy: req.user.id,
    };

    const resource = await Resource.create(resourceData);

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
      message: 'Resource uploaded successfully. You earned 1 point!',
      data: resource,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update resource
// @route   PUT /api/resources/:id
// @access  Private (owner or super_admin)
export const updateResource = async (req, res) => {
  try {
    let resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    // Check ownership
    if (resource.postedBy.toString() !== req.user.id && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this resource',
      });
    }

    // Update isVideo if link changed
    if (req.body.link) {
      req.body.isVideo = req.body.link.includes('youtube.com') || req.body.link.includes('youtu.be');
    }

    resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Resource updated successfully',
      data: resource,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete resource
// @route   DELETE /api/resources/:id
// @access  Private (owner or super_admin)
export const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    // Check ownership
    if (resource.postedBy.toString() !== req.user.id && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this resource',
      });
    }

    // Super admin: Permanently delete
    if (req.user.role === 'super_admin') {
      await Resource.findByIdAndDelete(req.params.id);
      
      return res.status(200).json({
        success: true,
        message: 'Resource permanently deleted',
      });
    }

    // Contributor: Soft delete (mark as deleted)
    resource.isDeleted = true;
    resource.deletedAt = new Date();
    await resource.save();

    // Deduct 1 point from user (except super_admin)
    if (req.user.role !== 'super_admin') {
      try {
        const updatedUser = await User.findByIdAndUpdate(
          resource.postedBy, 
          { $inc: { points: -1 } },
          { new: true, runValidators: true }
        );
        // Ensure points don't go below 0
        if (updatedUser.points < 0) {
          await User.findByIdAndUpdate(resource.postedBy, { points: 0 });
        }
        console.log(`Points deducted for user ${resource.postedBy}: ${updatedUser.points}`);
      } catch (pointsError) {
        console.error('Error updating points:', pointsError);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Resource deleted successfully. 1 point deducted.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Like resource
// @route   PUT /api/resources/:id/like
// @access  Public
export const likeResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    resource.likes += 1;
    await resource.save();

    res.status(200).json({
      success: true,
      likes: resource.likes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Increment download count
// @route   PUT /api/resources/:id/download
// @access  Public
export const incrementDownload = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    resource.downloads += 1;
    await resource.save();

    res.status(200).json({
      success: true,
      downloads: resource.downloads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get my posted resources
// @route   GET /api/resources/my-resources
// @access  Private
export const getMyResources = async (req, res) => {
  try {
    // Contributors should not see their soft-deleted resources
    const resources = await Resource.find({ postedBy: req.user.id, isDeleted: { $ne: true } })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: resources.length,
      data: resources,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
